import React from 'react'
import { Formik } from 'formik'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

function Booking() {
    function handleRadioChange(e, values) {
        var service = values.services, details = values.details;
        service = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] };
        details = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] };

        while (e.target.value > 0) {
            console.log(e.target.value, service, "before", details)
            if (e.target.value === 1) {
                service[0].splice(0, 1, { name: '', email: '', number: '', birthDate: new Date() })
                details[0].splice(0, 1, { name: 'hi', type: '', price: '' })
            } else {
                details[e.target.value - 1].splice(e.target.value - 1, 1, { name: '', type: '', price: '' })
                service[e.target.value - 1].splice(e.target.value - 1, 1, { name: 'hi', birthDate: new Date() })
            }
            e.target.value--;
            console.log(e.target.value, "afterrr", service, details)
        }
    }

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
            // onChange={(values, e) => {
            //     handleChange(e)
            //     addService(e, values.services, values.details);
            // }}
            >
                {
                    ({ values, touched, handleChange, handleSubmit, handleBlur, isSubmitting, setFieldValue }) => (
                        <form onSubmit={handleSubmit}>
                            <h2>1. Number of Atendees</h2>
                            <input type='radio' name='attendees' value="1" onChange={e => handleRadioChange(e, values)} onBlur={handleBlur} />
                            <label>1</label>
                            <input type='radio' name='attendees' value="2" onChange={e => handleRadioChange(e, values)} onBlur={handleBlur} />
                            <label>2</label>
                            <input type='radio' name='attendees' value="3" onChange={e => handleRadioChange(e, values)} onBlur={handleBlur} />
                            <label>3</label>
                            <input type='radio' name='attendees' value="4" onChange={e => handleRadioChange(e, values)} onBlur={handleBlur} />
                            <label>4</label>
                            <input type='radio' name='attendees' value="5" onChange={e => handleRadioChange(e, values)} onBlur={handleBlur} />
                            <label>5</label>
                            <input type='radio' name='attendees' value="6" onChange={e => handleRadioChange(e, values)} onBlur={handleBlur} />
                            <label>6</label><br />

                            <h2>2. In-clinic or at home</h2>
                            <input type='radio' name='HomeClinic' value="In-Clinic" onChange={handleChange} onBlur={handleBlur} />
                            <label>In-Clinic</label>
                            <input type='radio' name='HomeClinic' value="At Home" onChange={handleChange} onBlur={handleBlur} />
                            <label>At Home</label><br />

                            <h2>3. Date and Time</h2>
                            <DatePicker name='userDate' selected={values.userDate} onChange={date => setFieldValue('userDate', date)} minDate={new Date()} />
                            <br />

                            {/* {values.services.map((service, i) => (
                                <div>{i + 1}</div>
                            ))} */}
                            <h2>4. Select your services </h2>
                            {/* {values.details[0].map((det, i) => <div> {i} </div>)} */}
                            <p>{values.services[0].name}</p>
                        </form>
                    )
                }

            </Formik >
        </>
    )
}

export default Booking