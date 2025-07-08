import { serverClient } from "@/lib/server/serverClient";
import { gql } from "@apollo/client";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: NextRequest) {
  const { query, variables } = await request.json();

  try {
    let result;
    if (query.trim().startsWith("mutation")) {
      // Handle mutation
      result = await serverClient.mutate({
        mutation: gql`
          ${query}
        `,
        variables,
      });
    } else {
      // Handle query
      result = await serverClient.query({
        query: gql`
          ${query}
        `,
        variables,
      });
    }

    const data = result.data || {};
    console.log("GraphQL Response:", data);

    return NextResponse.json(
      {
        data,
      },
      {
        headers:corsHeaders
      }
    );
  } catch (error) {
    console.error("GraphQL Error:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
