/**
 * Use this module file to create instances of all authentication and simplify imports in to your routers
 */

import CreateUser from './CreateUser';
import LoginUser from './LoginUser';
import VerifyUserEmail from './VerifyUserEmail';

const createUser = new CreateUser();
const loginUser = new LoginUser();
const verifyUserEmail = new VerifyUserEmail();

export { createUser, loginUser, verifyUserEmail };
