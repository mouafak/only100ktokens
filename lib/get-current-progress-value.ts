import { growthPlan } from "@/constant/growthPlan";

export const getCurrentProgressValue = (): number => {
    const now = Date.now();
    for (let i = 0; i < growthPlan.length; i++) {
        const point = growthPlan[i];
        if (point.timestamp > now) {
            return point.value;
        }
    }
    return 5000;
};
