/**
 * Use this module file to create instances of all authentication and simplify imports in to your routers
 */

import CreateUser from './CreateUser';
import LoginUser from './LoginUser';

export const createUser = new CreateUser();
export const loginUser = new LoginUser();
