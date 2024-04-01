import React, { useState } from 'react'
import { Formik } from 'formik'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import Services from './Services'
import TimeSlots from './TimeSlots'
import * as Yup from 'yup'

function Booking() {
    const elements = [0, 1, 2, 3, 4, 5];
    const [total, setTotal] = useState(0);
    const [serviceLists, setService] = useState({});

    function handleRadioChange(e, values, form) {
        form.handleChange(e);

        var service = {};
        var details = {};
        var newService = {};

        while (e.target.value > 0) {
            if (e.target.value === '1' && (values.details[0]?.length === 0 || !values.details[e.target.value - 1] === undefined)) {
                details[0] = [{ name: '', email: '', contact: '', birthDate: '' }]
            } else if (values.details[e.target.value - 1]?.length === 0 || values.details[e.target.value - 1] === undefined) {
                details[e.target.value - 1] = [{ name: '', birthDate: '' }]
            } else {
                details[e.target.value - 1] = values.details[e.target.value - 1]
            }

            // console.log(values.services, "service")
            if (values.services[e.target.value - 1]?.length === 0 || values.services[e.target.value - 1] === undefined) {
                service[e.target.value - 1] = [{ loc: false, name: '', type: '', price: '' }]
            } else {
                service[e.target.value - 1] = values.services[e.target.value - 1]
            }

            if (!serviceLists[e.target.value - 1]) {
                const shots = Services.filter(shot => shot.type === 'IV Drip Therapy')
                newService[e.target.value - 1] = shots
            } else {
                newService[e.target.value - 1] = serviceLists[e.target.value - 1]
            }
            e.target.value--;
        }
        console.log(newService, "newwwww")
        setService(newService);
        form.setFieldValue('services', service)
        form.setFieldValue('details', details)
    }

    function handleShots(e) {
        const Lists = Services.filter(serv => serv.type === e.target.value)
        const AttNum = e.target.name.slice(-1);

        var newServ = serviceLists;
        newServ[AttNum] = Lists
        setService(newServ)
    }

    function handleService(e, num, values, form) {
        const { value, checked } = e.target;
        var shotLists = values.services
        console.log(shotLists, "checkeddd")
        if (checked) {
            const matchServ = Services.filter(serv => serv.name === value)
            const finalServ = {
                loc: false,
                name: matchServ[0].name,
                type: matchServ[0].type,
                price: matchServ[0].price
            }
            if (!shotLists[num][0].name) {
                shotLists[num].splice(0, 1, finalServ)
            } else {
                shotLists[num].push(finalServ)
            }
        } else {
            var reply = shotLists[num].filter((item) => item.name !== value)
            console.log(reply)
            if (reply.length === 0) {
                reply = [{ loc: false, name: '', type: '', price: '' }]
            }
            shotLists[num] = reply;
        }

        var sum = 0, i = 0;
        while (i < 6) {
            shotLists[i]?.map((serv) => sum += Number(serv.price))
            setTotal(sum)
            i++;
        }
        form.setFieldValue('services', shotLists)
        console.log(values.services[0], "shotListss")
    }

    function handleDetails(e, values, form, num) {
        const { name, value } = e.target;
        if (name === 'name') {
            values.details[num][0].name = value;
        } else if (name === 'email') {
            values.details[num][0].email = value;
        } else {
            values.details[num][0].contact = value;
        }
        form.setFieldValue('details', values.details)
    }

    function handleBirthDate(date, values, form, num) {
        values.details[num].birthDate = date;
        form.setFieldValue('details', values.details)
    }

    function handleHomeClinic(e, num, values, form) {
        var def = serviceLists;
        if (e.target.checked) {
            values.services[num][0].loc = true
            def[num] = [];
        } else {
            def[num] = Services.filter(shot => shot.type === 'IV Drip Therapy')
            values.services[num][0].loc = false
        }
        setService(def);
        form.setFieldValue('services', values.services)
    }

    const yupValidate = Yup.object().shape({
        // services: Yup.object().shape({
        //     0: Yup.array().of(
        //         Yup.object().shape({
        //             name: Yup.string().required('Select name'),
        //             name: Yup.string().when('loc', { is: 'false', then: Yup.string().required('Serive Req') }),
        //         }))
        // })

        attendees: Yup.string().required('Please select attendee(s)!'),
        HomeClinic: Yup.string().required('Please choose treatment area!'),
        userDate: Yup.string().min(new Date().getDate() + 1, 'Cannot book for today! Selected Date must be of tomorrow or higher date!'),
        timings: Yup.string().required('Please select a TimeSlot!'),
        services: Yup.object().shape({
            ...(() => {
                const testing = {}
                elements.map((ele) => {
                    Object.assign(testing, {
                        [ele]: Yup.array().of(
                            Yup.object().shape({
                                name: Yup.string().test('name test', 'Select at least one serviced for now! Or else decide at venue!', function (value, ctx) {
                                    if (ctx.from[0].value?.loc) return true
                                    else return ctx.from[0].value.loc
                                })
                            }))
                    }
                    )
                }
                )
                return testing
            })()
        }
        ),
        details: Yup.object().shape({
            ...(() => {
                const testing = {}
                elements.map((ele) => {
                    Object.assign(testing, {
                        [ele]: Yup.array().of(
                            Yup.object().shape({
                                name: Yup.string().required('Enter Name!'),
                                birthDate: Yup.string().required('Please Select Date of Birth!'),
                                email: Yup.string().email('Enter valid Email').test('email test', 'Enter email ID', function (value, ctx) {
                                    if (ctx.from[0].value?.hasOwnProperty('email')) return value?.length > 0
                                    else return true
                                }),
                                contact: Yup.string().test('contact test', 'Enter contact number', function (value, ctx) {
                                    if (ctx.from[0].value?.hasOwnProperty('contact')) return value?.length > 0
                                    else return true
                                })
                            }))
                    }
                    )
                }
                )
                return testing
            })()
        }
        ),
    })

    function handleClick(errors){
        console.log(errors)
    }

    return (
        <>
            <div className='mainDiv'>
                <Formik
                    initialValues={{
                        attendees: '', HomeClinic: '', userDate: new Date(), timings: '',
                        services: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] },
                        details: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] },
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            console.log(values)
                            setSubmitting(false);
                        }, 400);
                    }}
                    validateOnBlur={false}
                    validateOnChange={false}
                    validationSchema={yupValidate}
                // validate={(values) => {
                //     if (!values.attendees) {
                //         alert('Attendees Required');
                //     } else if (!values.HomeClinic) {
                //         alert('Home or Clinic Choice Required')
                //     } else if (!values.userDate) {
                //         alert('Appointment Date Required')
                //     } else if (!values.timings) {
                //         alert('Time Slot Required')
                //     } else if (!values.services[0].name) {
                //         alert('Service Required')
                //     } else if (!values.details[0].name) {
                //         alert('Details Required')
                //     }
                // }}
                >
                    {
                        ({ values, handleChange, handleSubmit, handleBlur, isSubmitting, setFieldValue, errors }) => (
                            <form onSubmit={handleSubmit}>
                                <h2>1. Number of Atendees</h2>
                                <input type='radio' name='attendees' value="1" onChange={e => handleRadioChange(e, values, { handleChange, setFieldValue })} onBlur={handleBlur} />
                                <label>1</label>
                                <input type='radio' name='attendees' value="2" onChange={e => handleRadioChange(e, values, { handleChange, setFieldValue })} onBlur={handleBlur} />
                                <label>2</label>
                                <input type='radio' name='attendees' value="3" onChange={e => handleRadioChange(e, values, { handleChange, setFieldValue })} onBlur={handleBlur} />
                                <label>3</label>
                                <input type='radio' name='attendees' value="4" onChange={e => handleRadioChange(e, values, { handleChange, setFieldValue })} onBlur={handleBlur} />
                                <label>4</label>
                                <input type='radio' name='attendees' value="5" onChange={e => handleRadioChange(e, values, { handleChange, setFieldValue })} onBlur={handleBlur} />
                                <label>5</label>
                                <input type='radio' name='attendees' value="6" onChange={e => handleRadioChange(e, values, { handleChange, setFieldValue })} onBlur={handleBlur} />
                                <label>6</label><br />
                                <div className='validate'>{errors?.attendees}</div>

                                <h2>2. In-clinic or at home</h2>
                                <input type='radio' name='HomeClinic' value="In-Clinic" onChange={handleChange} onBlur={handleBlur} />
                                <label>In-Clinic</label>
                                <input type='radio' name='HomeClinic' value="At Home" onChange={handleChange} onBlur={handleBlur} />
                                <label>At Home</label><br />
                                <div className='validate'>{errors?.HomeClinic}</div>

                                <h2>3. Date and Time</h2>
                                <DatePicker name='userDate' selected={values.userDate} onChange={date => setFieldValue('userDate', date)} minDate={new Date()} />
                                <select name='timings' onChange={handleChange}>
                                    {TimeSlots.map((time) => (
                                        <option value={time}>{time}</option>
                                    ))}
                                </select>
                                <br />
                                <div className='validate'>{errors?.userDate}</div>
                                <div className='validate'>{errors?.timings}</div>

                                {values.services[0].length > 0 &&
                                    <h2>4. Select your services </h2>}

                                {elements.map(num => (
                                    values.services[num]?.length > 0 &&
                                    <>
                                        <h3>Attendee {num + 1} </h3>
                                        <input type='checkbox' onChange={e => handleHomeClinic(e, num, values, { setFieldValue })} checked={values.services[num].loc} name='homeClinic' value={num} />
                                        <label>Decide {values?.HomeClinic ? values?.HomeClinic : "In Clinic"}</label> <br />

                                        <input type='radio' name={`Shots${num}`} value='IV Drip Therapy' onChange={e => { handleChange(e); handleShots(e) }} onBlur={handleBlur} checked={serviceLists[num][0]?.type === 'IV Drip Therapy'} />
                                        <label>IV Drip Therapy</label>
                                        <input type='radio' name={`Shots${num}`} value='Vitamin Shots' onChange={e => { handleChange(e); handleShots(e) }} onBlur={handleBlur} checked={serviceLists[num][0]?.type === 'Vitamin Shots'} />
                                        <label>Vitamin Shots</label>
                                        {serviceLists[num]?.map((shot, i) => (
                                            <>
                                                <input type='checkbox' checked={values.services[num].find((val) => val.name.includes(shot.name))} onChange={e => { handleChange(e); handleService(e, num, values, { setFieldValue }) }} value={shot.name} name={`Products${num}`} />
                                                <label>{shot.name}</label>
                                            </>
                                        ))}
                                        <div className='validate'> {errors?.services?.[num]?.map((msg) => <>{msg?.name}</>)} </div>
                                    </>
                                ))
                                }

                                {values.details[0]?.length > 0 &&
                                    <h2>Enter your contact details</h2>}

                                {elements.map(num => (
                                    values.details[num]?.length > 0 &&
                                    <>
                                        <h3>Attendee {num + 1}</h3>
                                        <label>NAME</label>
                                        <input type='text' name='name' value={values.details[num][0].name} onChange={e => handleDetails(e, values, { setFieldValue }, num)} onBlur={handleBlur} /> <br />
                                        <div className='validate'> {errors?.details?.[num]?.[0]?.name} </div>
                                        {num === 0 &&
                                            <>
                                                <label>EMAIL</label>
                                                <input type='text' name='email' value={values.details[num][0].email} onChange={e => handleDetails(e, values, { setFieldValue }, num)} onBlur={handleBlur} /> <br />
                                                <div className='validate'> {errors?.details?.[num]?.[0]?.email} </div>
                                                <label>CONTACT NO.</label>
                                                <input type='text' name='contact' value={values.details[num][0].contact} onChange={e => handleDetails(e, values, { setFieldValue }, num)} onBlur={handleBlur} /> <br />
                                                <div className='validate'> {errors?.details?.[num]?.[0]?.contact} </div>
                                            </>
                                        }
                                        <label>DATE OF BIRTH</label>
                                        <DatePicker name='birthDate' selected={values.details[num][0].birthDate} onChange={date => handleBirthDate(date, values, { setFieldValue }, num)} />
                                        <div className='validate'> {errors?.details?.[num]?.[0]?.birthDate} </div>
                                    </>
                                ))}

                                <h2>YOUR BOOKING</h2>
                                {elements.map(num => (
                                    values.services[num]?.length > 0 &&
                                    <>
                                        <h3>Attendee {num + 1} </h3>
                                        {values.services[num]?.map((serve) => (
                                            <>
                                                <div className='billing'>
                                                    <div>{serve.name}</div>
                                                    <div> {serve.price}</div>
                                                </div>
                                            </>
                                        ))}
                                    </>
                                ))}
                                {values.attendees &&
                                    <>
                                        <div className='billing'>
                                            <div>GRAND TOTAL</div>
                                            <div>{total}</div>
                                        </div> <br />
                                    </>
                                }
                                <button type='submit' onClick={handleClick(errors)} disabled={isSubmitting}>{isSubmitting ? 'Submitting..' : 'Submit'}</button>
                            </form>
                        )
                    }
                </Formik >
            </div>
        </>
    )
}

export default Booking