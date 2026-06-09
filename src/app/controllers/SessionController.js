import * as Yup from 'yup';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

class SessionController {
  async store(request, response) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });
    const isValid = await schema.isValidSync(request.body, { strict: true });

    const emailOrPassowordIncorrect = () => {
      return response
        .status(400)
        .json({ error: 'Email or password incorrect' });
    };

    if (!isValid) {
      emailOrPassowordIncorrect();
    }

    const { email, password } = request.body;

    const userExists = await User.findOne({
      where: { email },
    });

    if (!userExists) {
      emailOrPassowordIncorrect();
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userExists.password_hash,
    );

    if (!isPasswordValid) {
      emailOrPassowordIncorrect();
    }

    return response.status(200).json({
      id: userExists.id,
      name: userExists.name,
      email: userExists.email,
      admin: userExists.admin,
    });
  }
}

export default new SessionController();
