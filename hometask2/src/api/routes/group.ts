import { Router, Request, Response } from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import { IGroupSchemas } from '../../interfaces';
import * as schema from '../../validate/group.schemas';
import {
  findGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  getAllGroups,
} from '../../services/group.service';
import { addUsersToGroup } from '../../services/usergroup.service';
import logger from '../../utils/logger';

const route = Router();
const validator = createValidator();

export default (app: Router) => {
  app.use('/group', route);

  route.get(
    '/:id',
    validator.body(schema.schemaGetGroup),
    async (req: ValidatedRequest<IGroupSchemas.GetGroupRequestSchema>, res: Response) => {
      const { id } = req.body;

      try {
        const group = await findGroupById(id);
        res.status(200).json({ status: 200, data: group });
      } catch (error: any) {
        res.status(404).json({ status: 404, message: error.message });
        logger.error(`method: GET, arguments: ${JSON.stringify(req.body)}, text: ${error.message}`);
      }
    }
  );

  route.post(
    '/',
    validator.body(schema.schemaCreateGroup),
    async (req: ValidatedRequest<IGroupSchemas.CreateGroupRequestSchema>, res: Response) => {
      try {
        const group = await createGroup(req.body);
        res.status(200).json({ status: 200, data: group });
      } catch (error: any) {
        res.status(404).json({ status: 400, message: error.message });
        logger.error(
          `method: POST, arguments: ${JSON.stringify(req.body)}, text: ${error.message}`
        );
      }
    }
  );

  route.put(
    '/:id',
    validator.body(schema.schemaUpdateGroup),
    async (req: ValidatedRequest<IGroupSchemas.UpdateGroupRequestSchema>, res: Response) => {
      try {
        const group = await updateGroup(req.body);
        res
          .status(200)
          .json({ status: 200, data: group, message: `Group ${group.id} was updated` });
      } catch (error: any) {
        res.status(404).json({ status: 404, message: error.message });
        logger.error(`method: PUT, arguments: ${JSON.stringify(req.body)}, text: ${error.message}`);
      }
    }
  );

  route.get(
    '/',
    validator.body(schema.schemaGetGroupsList),
    async (req: ValidatedRequest<IGroupSchemas.GetGroupsListRequestSchema>, res: Response) => {
      try {
        const groups = await getAllGroups();
        res.status(200).json({ status: 200, data: groups });
      } catch (error: any) {
        res.status(404).json({ status: 404, message: error.message });
        logger.error(`method: GET, arguments: ${JSON.stringify(req.body)}, text: ${error.message}`);
      }
    }
  );

  route.delete(
    '/:id',
    validator.body(schema.schemaDeleteGroup),
    async (req: ValidatedRequest<IGroupSchemas.DeleteGroupRequestSchema>, res: Response) => {
      const { id } = req.body;

      try {
        const group = await deleteGroup(id);
        res.status(200).json({ status: 200, data: group.id, message: `Group ${id} was deleted` });
      } catch (error: any) {
        res.status(404).json({ status: 404, message: error.message });
        logger.error(
          `method: DELETE, arguments: ${JSON.stringify(req.body)}, text: ${error.message}`
        );
      }
    }
  );

  route.post(
    '/users/',
    validator.body(schema.schemaAddUsersToGroup),
    async (req: ValidatedRequest<IGroupSchemas.AddUsersToGroupRequestSchema>, res: Response) => {
      const { groupId, userIds } = req.body;

      try {
        const data = await addUsersToGroup(groupId, userIds);
        res.status(200).json({ status: 200, data });
      } catch (error: any) {
        res.status(404).json({ status: 400, message: error.message });
        logger.error(
          `method: POST, arguments: ${JSON.stringify(req.body)}, text: ${error.message}`
        );
      }
    }
  );
};
