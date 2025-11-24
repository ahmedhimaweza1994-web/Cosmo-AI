import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

// Get all companies for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const companies = await prisma.company.findMany({
            where: { userId },
            include: {
                branding: true,
                socialAccounts: true,
                assets: true,
                marketingPlan: true
            }
        });
        res.json(companies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch companies' });
    }
});

// Create a new company
router.post('/', async (req, res) => {
    try {
        const { userId, name, industry, description, website, targetAudience, competitors, goals, language } = req.body;

        const company = await prisma.company.create({
            data: {
                userId,
                name,
                industry,
                description,
                website,
                targetAudience,
                competitors,
                goals,
                language,
                branding: {
                    create: {
                        primaryColor: '#00d2ff',
                        secondaryColor: '#9d50bb',
                        fontPairing: 'Inter/Roboto'
                    }
                }
            },
            include: {
                branding: true,
                socialAccounts: true,
                assets: true
            }
        });

        // Update user's last accessed company
        await prisma.user.update({
            where: { id: userId },
            data: { companyId: company.id }
        });

        res.json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create company' });
    }
});

// Update company
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Separate nested updates if necessary, for now assuming direct mapping
        // But we need to handle branding separately if it's passed
        const { branding, ...companyData } = data;

        const company = await prisma.company.update({
            where: { id },
            data: {
                ...companyData,
                ...(branding && {
                    branding: {
                        upsert: {
                            create: branding,
                            update: branding
                        }
                    }
                })
            },
            include: {
                branding: true,
                socialAccounts: true,
                assets: true
            }
        });
        res.json(company);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update company' });
    }
});

// Get single company
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const company = await prisma.company.findUnique({
            where: { id },
            include: {
                branding: true,
                socialAccounts: true,
                assets: true,
                marketingPlan: {
                    include: {
                        posts: true,
                        ads: { include: { adSets: true } }
                    }
                }
            }
        });
        if (!company) return res.status(404).json({ error: 'Company not found' });
        res.json(company);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch company' });
    }
});

export default router;
