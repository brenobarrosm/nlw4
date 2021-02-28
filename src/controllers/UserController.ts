import { AppError } from './../errors/AppError';
import { Request, Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import * as yup from 'yup';

class UserController {

    async create(request: Request, response: Response) {
        const { name, email } = request.body;

        //Validação
        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        });

        try {
            //O "abortEarly: false", faz com que as validações rodem todas juntas
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            throw new AppError(err);
        }

        //Outra maneira de validar:

        // if (!(await !schema.isValid(request.body, { abortEarly: false }))) {
        //     return response.status(400).json({
        //         error: "validation failed"
        //     });
        // }

        const usersRepository = getCustomRepository(UserRepository);

        const userAlreadyExists = await usersRepository.findOne({
            email
        })

        if (userAlreadyExists) {
            throw new AppError("User already exists");
        }

        const user = usersRepository.create({
            name, email
        });

        await usersRepository.save(user);

        return response.status(201).json(user);
    }

}

export { UserController }