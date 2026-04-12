import { auth } from "@/services/firebaseClient";
import { isAdminEmail } from "@/utils/admin";

export async function getAdminRequestHeaders(
  baseHeaders: Record<string, string> = {}
) {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("Vui lòng đăng nhập tài khoản admin để tiếp tục.");
  }

  if (!isAdminEmail(currentUser.email)) {
    throw new Error("Tài khoản hiện tại không có quyền quản trị.");
  }

  const idToken = await currentUser.getIdToken();

  return {
    ...baseHeaders,
    Authorization: `Bearer ${idToken}`,
  };
}
