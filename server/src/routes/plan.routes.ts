import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

// Get Plan by Company ID
router.get('/company/:companyId', async (req, res) => {
    try {
        const { companyId } = req.params;
        const plan = await prisma.marketingPlan.findUnique({
            where: { companyId },
            include: {
                posts: true,
                ads: {
                    include: { adSets: true }
                }
            }
        });
        res.json(plan);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch plan' });
    }
});

// Create or Update Plan
router.post('/', async (req, res) => {
    try {
        const { companyId, weeklyThemes, strategySummary, posts, ads } = req.body;

        // Transaction to ensure consistency
        const plan = await prisma.$transaction(async (tx) => {
            // Upsert Plan
            const upsertedPlan = await tx.marketingPlan.upsert({
                where: { companyId },
                create: {
                    companyId,
                    weeklyThemes,
                    strategySummary
                },
                update: {
                    weeklyThemes,
                    strategySummary
                }
            });

            // Handle Posts (Delete existing for simplicity in this MVP, or upsert)
            // For MVP: Delete all posts for this plan and recreate (simplest sync)
            await tx.post.deleteMany({ where: { planId: upsertedPlan.id } });
            if (posts && posts.length > 0) {
                await tx.post.createMany({
                    data: posts.map((p: any) => ({
                        ...p,
                        planId: upsertedPlan.id,
                        id: undefined // Ensure new IDs are generated
                    }))
                });
            }

            // Handle Ads
            await tx.adCampaign.deleteMany({ where: { planId: upsertedPlan.id } });
            if (ads && ads.length > 0) {
                for (const ad of ads) {
                    await tx.adCampaign.create({
                        data: {
                            planId: upsertedPlan.id,
                            name: ad.name,
                            platform: ad.platform,
                            objective: ad.objective,
                            budget: ad.budget,
                            status: ad.status,
                            adSets: {
                                create: ad.adSets
                            }
                        }
                    });
                }
            }

            return upsertedPlan;
        });

        // Fetch full plan to return
        const fullPlan = await prisma.marketingPlan.findUnique({
            where: { id: plan.id },
            include: {
                posts: true,
                ads: { include: { adSets: true } }
            }
        });

        res.json(fullPlan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save plan' });
    }
});

export default router;
