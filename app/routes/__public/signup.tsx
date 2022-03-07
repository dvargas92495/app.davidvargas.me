import getMeta from "@dvargas92495/ui/utils/getMeta";
import { SignUp } from "@clerk/remix";
import getRootAuthedLoader from "@dvargas92495/ui/utils/getRootAuthedLoader";

export const loader = getRootAuthedLoader();
export const meta = getMeta({ title: "Sign up" });
export default SignUp;
