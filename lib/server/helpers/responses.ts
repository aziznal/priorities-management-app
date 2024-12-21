import { NextResponse } from "next/server";

function buildErrorResponse({
  status,
  statusText,
  message,
}: {
  status: number;
  statusText: string;
  message?: string;
}) {
  return NextResponse.json(
    {
      error: message,
    },
    {
      status,
      statusText,
    },
  );
}

type ErrorResponseParams = {
  message?: string;
};

export function buildBadRequestResponse(params?: ErrorResponseParams) {
  return buildErrorResponse({
    message: params?.message ?? "Bad request",
    status: 400,
    statusText: "Bad request",
  });
}

export function buildNotFoundResponse(params?: ErrorResponseParams) {
  return buildErrorResponse({
    message: params?.message ?? "Resource not found",
    status: 404,
    statusText: "Resource not found",
  });
}

export function buildServerErrorResponse(params?: ErrorResponseParams) {
  return buildErrorResponse({
    message: params?.message ?? "Server encountered an oopsie",
    status: 500,
    statusText: "Server encountered an oopsie",
  });
}

export function buildOkResponseWithData<T>({ data }: { data: T }) {
  return NextResponse.json(
    {
      data,
    },
    {
      status: 200,
      statusText: "Items fetched successfully",
    },
  );
}

export function buildOkResponse() {
  return NextResponse.json(
    {},
    {
      status: 200,
    },
  );
}
