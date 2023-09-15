import React, { useState } from 'react';
// typed redux hooks
import { useAppDispatch } from '@app/hooks/redux_hooks';

// form controller
import { useFormik } from "formik";
import * as Yup from 'yup';
// for translation
import { useTranslation } from 'react-i18next';

// custom styles
import styles from './Login.module.scss';
import { Button, Input, Paper, SizedBox } from '@app/compLibrary';
// company logo
import logo from "@app/assets/images/logo.png";
// api helpers
import { post } from '@api/service/api_helper';
import { useMutation } from 'react-query';

import axios from 'axios';
import moment from 'moment';
import { useNavigate } from '@tanstack/react-location';  
// for notification
import toast from 'react-hot-toast';
// helper function
import { axiosInstance } from '@app/api/axiosInstance';

interface FormikValues {
   username: string
   password: string
}

type LoginProps = {

}

const Login = (props: LoginProps) => {
   const { t } = useTranslation();
   // state for show|hide password
   const [showPassword, setShowPassword] = useState(false);
   const mutation = useMutation(data => axiosInstance.post('/auth/login', data))
   const navigate = useNavigate()

   const formik = useFormik<FormikValues>({
      initialValues: {
         username: '',
         password: '',
      },
      validationSchema: Yup.object({
         username: Yup.string()
            .min(3, t('nameMin'))
            .required(t('requiredField')),
         password: Yup.string()
            .min(3, t('passwordMin'))
      }),
      onSubmit: async (values: any, { resetForm })  => {
         try {
            const res = await mutation.mutateAsync(values)
            console.log("res,", res)
            if (res.data.refresh_token) {
               console.log(res)
               toast.success(t('loggedIn'))
               localStorage.setItem(
                  'authUser',
                  JSON.stringify({
                     access_token: res.data.access_token,
                     refresh_token: res.data.refresh_token,
                     is_superuser: res.data.data.is_superuser,
                     user_name: res.data.data.user_name
                  })
               )
               localStorage.setItem('accessTokenCreatedTime', moment(new Date()).format("YYYY-MM-DD HH:mm:ss"))
               navigate({ to: '/', replace: true })
               window.location.reload()
               resetForm()
            }
         } catch (err) {
            console.log(err);
            if (axios.isAxiosError(err)) {
               if (err.response) {
                  if (err.response.status === 401 || err.response.status === 403 || err.response.status === 400 || err.response.status === 404)
                     toast.error(`${err.response.data}`);
               }
            }
         }
      }
   })


   return (
      <>
      <div className={styles.wrapper}>
            <div className={styles.loginWrapper}>
               <form onSubmit={formik.handleSubmit}>
                  <Paper rounded>
                     <div className={styles.loginInner}>
                        <img src={logo} alt="Company logo" width={100} />
                        <SizedBox height={20} />
                        <div className={styles.inputWrapper}>
                           <span className={styles.inputTitle}>
                              {t('userName')}
                           </span>
                           <SizedBox height={10} />
                           <Paper fullWidth rounded>
                              <div className={styles.inputInner}>
                                 <Input
                                    fontWeight='bold'
                                    fontSize='big'
                                    type='text'
                                    name="username"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.username}
                                    style={{ width: '100%' }}
                                 />
                              </div>
                           </Paper>
                           <SizedBox height={5} />
                           {formik.touched.username && formik.errors.username ? (
                              <span className={styles.errorTxt}>{formik.errors.username}</span>
                           ) : null}
                        </div>
                        <SizedBox height={15} />
                        <div className={styles.inputWrapper}>
                           <span className={styles.inputTitle}>
                              {t('password')}
                           </span>
                           <SizedBox height={10} />
                           <Paper fullWidth rounded>
                              <div className={styles.inputInner}>
                                 <Input
                                    fontWeight='bold'
                                    fontSize='big'
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                    style={{ width: '100%' }}
                                 />
                                 <Button circle isIconContent type='text' onClick={() => setShowPassword(!showPassword)}>
                                    {
                                       showPassword ?
                                          <i className='bx bx-show'></i>
                                          :
                                          <i className='bx bx-hide'></i>
                                    }
                                 </Button>
                              </div>
                           </Paper>
                           <SizedBox height={5} />
                           {formik.touched.password && formik.errors.password ? (
                              <span className={styles.errorTxt}>{formik.errors.password}</span>
                           ) : null}
                        </div>
                        <SizedBox height={20} />
                        <Button rounded fullWidth center htmlType='submit'>
                           Login
                        </Button>
                     </div>
                  </Paper>
               </form>
            </div>
         </div>
      </>
   )
}

export default Login