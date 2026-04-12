import { DecodedIdToken } from "firebase-admin/auth";

import { adminAuth } from "@/services/firebaseAdmin";
import { getServerAdminEmails, isAdminEmail } from "@/utils/admin";

type VerifiedAdminResult =
  | {
      ok: true;
      token: DecodedIdToken;
      email: string;
    }
  | {
      ok: false;
      error: string;
      status: number;
    };

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim() || null;
}

export async function verifyAdminRequest(
  request: Request
): Promise<VerifiedAdminResult> {
  const idToken = getBearerToken(request);

  if (!idToken) {
    return {
      ok: false,
      error: "Vui lòng đăng nhập tài khoản admin để tiếp tục.",
      status: 401,
    };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email || "";

    if (!isAdminEmail(email, getServerAdminEmails())) {
      return {
        ok: false,
        error: "Tài khoản hiện tại không có quyền quản trị.",
        status: 403,
      };
    }

    return {
      ok: true,
      token: decodedToken,
      email,
    };
  } catch (error) {
    console.error("Admin token verification failed:", error);

    return {
      ok: false,
      error: "Không thể xác thực phiên quản trị. Vui lòng đăng nhập lại.",
      status: 401,
    };
  }
}
