from fastapi import APIRouter, Request, Query
from platforms import get_platform_handler
from utils import get_browser_context
import traceback
import time

router = APIRouter()

@router.get("/search")
async def search(query: str = Query(...), platform: str = Query(...), request: Request = None):
    handler = get_platform_handler(platform)
    if not handler:
        return {"error": f"Unsupported platform: {platform}"}

    context = await get_browser_context(request)
    page = await context.new_page()

    await page.set_extra_http_headers({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
    })
    await page.set_viewport_size({"width": 1280, "height": 800})

    start_time = time.time()
    results = []

    try:
        results = await handler.search(page, query)
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}
    finally:
        await page.close()
        await context.close()

    return {
        "platform": platform,
        "query": query,
        "results": results,
        "time_taken": round(time.time() - start_time, 2)
    }
