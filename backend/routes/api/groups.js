const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group } = require('../../db/models');
const { Member } = require('../../db/models');
const { Image } = require('../../db/models');

const router = express.Router();

//get all groups
router.get('/', async (req, res) => {
    const groups = await Group.findAll()

    return res.json({
        Groups: groups
    })
});

//get group and organizer by group id
router.get('/:groupId', async (req, res) => {
    const id = req.params.groupId;

    try {
        const group = await Group.findOne({
            where: {
                id: id
            }
        });

        const images = await Image.findAll({
            attributes: ['url'],
            where: {
                groupId: id
            }
        });

        const member = await Member.findOne({
            where: {
                groupId: id,
                organizer: true
            }
        });

        const user = await member.getUser({
            attributes: ['id', 'firstName', 'lastName'],
        });

        return res.json({
            Group: group,
            images: images,
            Organizer: user
        });

    } catch (error) {
        if (error.message === "Cannot read properties of null (reading 'getUser')") {
            res.status(404);
            return res.json({
                message: "Group couldn't be found",
                statusCode: 404
            });
        }
    }
});

module.exports = router;
