import React, { useState } from 'react'
import { Formik } from 'formik'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import Services from './Services'
import TimeSlots from './TimeSlots'

function Booking() {
    const elements = [0, 1, 2, 3, 4, 5];
    const [total, setTotal] = useState(0);
    const [serviceLists, setService] = useState({});

    function handleRadioChange(e, values, form) {
        form.handleChange(e);

        var service = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] };
        var details = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] };
        var newService = {};
        const IVDrip = Services.filter(shot => shot.type === 'IV Drip Therapy')

        while (e.target.value > 0) {
            if (e.target.value === '1') {
                details[0].splice(0, 1, { name: '', email: '', contact: '', birthDate: new Date() })
            } else {
                details[e.target.value - 1].splice(e.target.value - 1, 1, { name: '', birthDate: new Date() })
            }
            service[e.target.value - 1].splice(e.target.value - 1, 1, { loc: false, name: '', type: '', price: '' })
            newService[e.target.value - 1] = (IVDrip)

            e.target.value--;
        }
        setService(newService);
        form.setFieldValue('services', service)
        form.setFieldValue('details', details)
    }

    function handleShots(e) {
        const Lists = Services.filter(serv => serv.type === e.target.value)
        const AttNum = e.target.name.slice(-1);
        serviceLists[AttNum] = Lists
    }

    function handleService(e, num, values, form) {
        const { value, checked } = e.target;
        var shotLists = values.services
        if (checked) {
            const matchServ = Services.filter(serv => serv.name === value)
            shotLists[num].push(matchServ[0])
        } else {
            const reply = shotLists[num].filter((item) => item.name !== value)
            shotLists[num] = reply;
        }
        var sum = 0, i = 0;
        while (i < 6) {
            shotLists[i].map((serv) => sum += Number(serv.price))
            setTotal(sum)
            i++;
        }
        form.setFieldValue('services', shotLists)
    }

    function handleDetails(e, values, form, num) {
        const { name, value } = e.target;
        if (name === 'name') {
            values.details[num].name = value;
        } else if (name === 'email') {
            values.details[num].email = value;
        } else {
            values.details[num].contact = value;
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
            values.services[num].loc = true
            def[num] = [];
        } else {
            values.services[num].loc = false
            def[num] = Services.filter(shot => shot.type === 'IV Drip Therapy')
        }
        console.log(values.services, "valuueee")
        setService(def);
        form.setFieldValue('services', values.services)
    }

    // console.log(placeCheck, "outerrrr")

    return (
        <>
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
            >
                {
                    ({ values, touched, handleChange, handleSubmit, handleBlur, isSubmitting, setFieldValue }) => (
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

                            <h2>2. In-clinic or at home</h2>
                            <input type='radio' name='HomeClinic' value="In-Clinic" onChange={handleChange} onBlur={handleBlur} />
                            <label>In-Clinic</label>
                            <input type='radio' name='HomeClinic' value="At Home" onChange={handleChange} onBlur={handleBlur} />
                            <label>At Home</label><br />

                            <h2>3. Date and Time</h2>
                            <DatePicker name='userDate' selected={values.userDate} onChange={date => setFieldValue('userDate', date)} minDate={new Date()} />
                            <select name='timings' onChange={handleChange}>
                                {TimeSlots.map((time) => (
                                    <option value={time}>{time}</option>
                                ))}
                            </select>
                            <br />

                            {values.services[0].length > 0 &&
                                <h2>4. Select your services </h2>}

                            {elements.map(num => (
                                values.services[num].length > 0 &&
                                <>
                                    <h3>Attendee {num + 1} </h3>
                                    <input type='checkbox' onChange={e => handleHomeClinic(e, num, values, { setFieldValue })} checked={values.services[num].loc} name='homeClinic' value={num} />
                                    <label>Decide {values?.HomeClinic ? values?.HomeClinic : "In Clinic"}</label> <br />

                                    <input type='radio' name={`Shots${num}`} value='IV Drip Therapy' onChange={e => handleShots(e)} onBlur={handleBlur} />
                                    <label>IV Drip Therapy</label>
                                    <input type='radio' name={`Shots${num}`} value='Vitamin Shots' onChange={e => handleShots(e)} onBlur={handleBlur} />
                                    <label>Vitamin Shots</label>

                                    {serviceLists[num]?.map((shot) => (
                                        <>
                                            <input type='checkbox' checked={values.services[num]?.name?.includes(shot?.name)} onChange={e => handleService(e, num, values, { setFieldValue })} value={shot.name} />
                                            <label>{shot.name}</label>
                                        </>
                                    ))}
                                </>
                            ))
                            }

                            {values.details[0].length > 0 &&
                                <h2>Enter your contact details</h2>}

                            {elements.map(num => (
                                values.details[num].length > 0 &&
                                <>
                                    <h3>Attendee {num + 1}</h3>
                                    <label>NAME</label>
                                    <input type='text' name='name' value={values.details[num].name} onChange={e => handleDetails(e, values, { setFieldValue }, num)} onBlur={handleBlur} /> <br />
                                    {num === 0 &&
                                        <>
                                            <label>EMAIL</label>
                                            <input type='text' name='email' value={values.details[num].email} onChange={e => handleDetails(e, values, { setFieldValue }, num)} onBlur={handleBlur} /> <br />
                                            <label>CONTACT NO.</label>
                                            <input type='text' name='contact' value={values.details[num].contact} onChange={e => handleDetails(e, values, { setFieldValue }, num)} onBlur={handleBlur} /> <br />
                                        </>
                                    }
                                    <label>DATE OF BIRTH</label>
                                    <DatePicker name='birthDate' selected={values.details[num].birthDate} onChange={date => handleBirthDate(date, values, { setFieldValue }, num)} />
                                </>
                            ))}

                            <h2>YOUR BOOKING</h2>
                            {elements.map(num => (
                                values.services[num].length > 0 &&
                                <>
                                    <h3>Attendee {num + 1} </h3>
                                    {values.services[num].map((serve) => (
                                        <>
                                            <div className='billing'>
                                                <div>{serve.name}</div>
                                                <div> {serve.price}</div>
                                            </div>
                                        </>
                                    ))}
                                </>
                            ))}
                            <div className='billing'>
                                <div>GRAND TOTAL</div>
                                <div>{total}</div>
                            </div>
                        </form>
                    )
                }

            </Formik >
        </>
    )
}

export default Booking