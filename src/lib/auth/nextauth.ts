// Lazy — only creates the handler when a request hits this route
let _handler: any = null;

function getHandler() {
  if (!_handler) {
    const { getAuth } = require("@/lib/better-auth");
    // @ts-ignore
    const nextJsIntegration = require("better-auth/next-js");
    _handler = nextJsIntegration.toNextJsHandler(getAuth());
  }
  return _handler;
}

export function GET(...args: any[]) {
  return getHandler().GET(...args);
}
export function POST(...args: any[]) {
  return getHandler().POST(...args);
}
export function PATCH(...args: any[]) {
  return getHandler().PATCH(...args);
}
export function PUT(...args: any[]) {
  return getHandler().PUT(...args);
}
export function DELETE(...args: any[]) {
  return getHandler().DELETE(...args);
}

export default function auth() {
  const { getAuth } = require("@/lib/better-auth");
  return getAuth();
}
