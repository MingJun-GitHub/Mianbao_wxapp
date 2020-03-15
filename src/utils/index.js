import * as utils from './util'
import Http from './request'
import WXS from './wxs'
import Login from './login'
import triggerbus from 'triggerbus'

const wxPro = {
    ...utils,
    ...WXS,
    Http,
    Login,
	Bus: triggerbus(), // 来个发布订阅吧
	
}
export default wxPro