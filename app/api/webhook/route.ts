import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Placeholder: Log the payload (for future Zapier integration)
    console.log("Service Request Webhook Payload:", JSON.stringify(body, null, 2));

    // In the future, this would POST to Zapier webhook URL
    // const zapierResponse = await fetch(ZAPIER_WEBHOOK_URL, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(body),
    // });

    return NextResponse.json(
      {
        success: true,
        message: "Service request received",
        data: body,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process request",
      },
      { status: 500 }
    );
  }
}

