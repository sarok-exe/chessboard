import { Router } from "express";

import appRouter from "@/lib/appRouter";

const router = Router();

router.get("/analysis*", appRouter("features/analysis.html"));

router.get("/", async (req, res) => {
    res.redirect("/analysis");
});

export default router;