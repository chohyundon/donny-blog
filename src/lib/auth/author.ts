import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { AUTHOR_EMAIL, isAuthorEmail } from "@/lib/auth/constants";

export { AUTHOR_EMAIL, isAuthorEmail };

export async function getAuthUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

function e2eAuthorUser(): User {
  return {
    id: "e2e-author-id",
    email: AUTHOR_EMAIL,
    app_metadata: {},
    user_metadata: {
      full_name: "E2E Author",
      user_name: "e2e-author",
    },
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as User;
}

export async function requireAuthor() {
  if (process.env.ALLOW_E2E_BYPASS === "true") {
    const cookieStore = await cookies();
    if (cookieStore.get("e2e-author")?.value === "1") {
      return e2eAuthorUser();
    }
  }

  const user = await getAuthUser();
  if (!user || !isAuthorEmail(user.email)) {
    return null;
  }
  return user;
}
