import contextlib
from typing import AsyncIterator, TypedDict
import os
import httpx
import uvicorn
from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles


class State(TypedDict):
    http_client: httpx.AsyncClient


@contextlib.asynccontextmanager
async def lifespan(app: Starlette) -> AsyncIterator[State]:
    async with httpx.AsyncClient() as client:
        yield {"http_client": client}


async def discord_oauth(request: Request):
    client: httpx.AsyncClient = request.state.http_client

    response = await client.post(
        "https://discord.com/api/oauth2/token",
        content={
            "client_id": os.environ["DISCORD_CLIENT_ID"],
            "client_secret": os.environ["DISCORD_CLIENT_SECRET"],
            "grant_type": "authorization_code",
            "code": await request.json()["code"],
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    access_token = await response.json()

    return JSONResponse({"access_token": access_token})


app = Starlette(
    debug=True,
    routes=[
        Mount("/api", routes=[
                Route("/api/token", discord_oauth),
            ],
        ),
        Mount("/client", app=StaticFiles(directory="client"), name="client"),
    ],
    lifespan=lifespan,
)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3001)
