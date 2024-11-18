import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './env.js';
import { getAllContacts, getContactById } from './services/contacts.js';

export function setupServer() {
  const app = express();
  const PORT = Number(env('PORT', 3000));

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(cors());

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).send({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const contactId = req.params.contactId;
    const contact = await getContactById(contactId);
    if (!contact) {
      res.status(404).send({ status: 404, message: 'Contact not found' });
      return;
    }

    res.status(200).send({
      status: 200,
      message: 'Successfully found contact with id {contactId}!',
      data: contact,
    });
  });

  app.use((req, res, next) => {
    res.status(404).send({ status: 404, message: 'Route not found' });
  });
  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send({ status: 500, message: 'Internal server error' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
