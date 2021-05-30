import React, { useCallback, useState, Fragment } from 'react'
import axios from 'axios'

import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  UncontrolledAlert,
  Table,
} from 'reactstrap'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import CircularProgress from '@material-ui/core/CircularProgress'

import { ToastContainer, toast, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useDropzone } from 'react-dropzone'
import { AiFillFileImage } from 'react-icons/ai'

import jsPDF from 'jspdf'

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}))

const Main = () => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(null)
  const [formOpen, toggleForm] = useState(true)
  const [file, setFile] = useState(null)
  const [imageSource, setImageSource] = useState(null)
  const [name, setName] = useState(null)
  const [medicalID, setMedicalID] = useState(null)
  const [prediction, setPrediction] = useState(null)

  var doc = new jsPDF('p', 'mm', [200, 200])

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 1) {
      setFile(acceptedFiles[0])
    } else {
      toast.error('Select a single Image')
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/jpg',
  })
  var reader = new FileReader()
  reader.onload = function (event) {
    setImageSource(event.target.result)
  }
  if (file) reader.readAsDataURL(file)

  const predict = async () => {
    const data = new FormData()
    data.append('file', file)
    setLoading(true)
    await axios.post('http://127.0.0.1:5000/upload', data, {}).then((res) => {
      // then print response status
      console.log(res)
      setPrediction(res.data)
      setLoading(false)
    })
  }

  const classes = useStyles()
  const formik = useFormik({
    initialValues: {
      name: '',
      medicalID: '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Required!'),
      medicalID: Yup.string().required('Required!'),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log(values)
      console.log(file)
      setName(values['name'])
      setMedicalID(values['medicalID'])
      if (file === null) {
        toast.error('Upload an Image')
      } else {
        predict()
        toggleForm(false)
        resetForm(formik.initialValues)
      }
    },
  })

  return (
    <Fragment>
      <ToastContainer pauseOnFocusLoss={false} limit={1} transition={Bounce} />
      <Container>
        <Fragment>
          {formOpen && (
            <Row className='m-2 mt-0'>
              <Col sm='3'></Col>
              <Col sm='6'>
                <div>
                  <Card>
                    <CardBody>
                      <form onSubmit={formik.handleSubmit} id='form'>
                        <FormControl
                          className={classes.margin}
                          fullWidth
                          error={formik.errors.name && formik.touched.name}
                        >
                          <InputLabel htmlFor='name'>Patient Name</InputLabel>
                          <Input
                            id='name'
                            name='name'
                            type='text'
                            value={formik.values.name}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          />
                          <FormHelperText id='component-error-text-name'>
                            {formik.errors.name &&
                              formik.touched.name &&
                              formik.errors.name}
                          </FormHelperText>
                        </FormControl>
                        <FormControl
                          className={classes.margin}
                          fullWidth
                          error={
                            formik.errors.medicalID && formik.touched.medicalID
                          }
                        >
                          <InputLabel htmlFor='Medical ID'>
                            Medical ID
                          </InputLabel>
                          <Input
                            id='medicalID'
                            name='medicalID'
                            type='text'
                            value={formik.values.medicalID}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          />
                          <FormHelperText id='component-error-text-medicalID'>
                            {formik.errors.medicalID &&
                              formik.touched.medicalID &&
                              formik.errors.medicalID}
                          </FormHelperText>
                        </FormControl>
                        <div {...getRootProps()} className='m-3'>
                          <h6>Drag the image here, or click to select one</h6>
                          <input {...getInputProps()} />
                          {isDragActive ? (
                            <AiFillFileImage size='2.5rem' />
                          ) : (
                            <AiFillFileImage size='2.5rem' />
                          )}
                        </div>
                        <div className='text-center'>
                          <Button variant='contained' color='primary'>
                            Predict
                          </Button>
                        </div>
                      </form>
                    </CardBody>
                  </Card>
                </div>
              </Col>
              <Col sm='3'></Col>
            </Row>
          )}
        </Fragment>

        <Fragment>
          {formOpen && file && imageSource && (
            <Row className='m-2'>
              <Col sm='3'></Col>
              <Col sm='6'>
                <Card>
                  <CardBody>
                    {file && imageSource && (
                      <div>
                        <img
                          src={imageSource}
                          className='m-2'
                          alt='Preview'
                          width='150rem'
                          height='150rem'
                        />
                        <h6 className='mt-1 font-weight-bold'>{`Selected Image: ${file.name}`}</h6>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Col>
              <Col sm='3'></Col>
            </Row>
          )}
        </Fragment>

        <Fragment>
          {!formOpen && (
            <Row className='m-2'>
              <Col sm='3'></Col>
              <Col sm='6'>
                <Card>
                  <CardBody>
                    <Row>
                      <Col sm='6'>
                        {name && medicalID && file && (
                          <div>
                            <h6 className='mt-3'>{`Name: ${name}`}</h6>
                            <h6 className='mt-2'>{`Medical ID: ${medicalID}`}</h6>
                            <h6 className='mt-2'>{`Choosen Image: ${file.name}`}</h6>
                            {prediction && (
                              <h6 className='mt-2'>{`Prediction: ${(
                                prediction * 100
                              ).toFixed(2)} %`}</h6>
                            )}
                          </div>
                        )}
                      </Col>
                      <Col sm='6'>
                        {file && imageSource && (
                          <img
                            src={imageSource}
                            className='m-2'
                            alt='Preview'
                            width='150rem'
                            height='150rem'
                          />
                        )}
                      </Col>
                    </Row>

                    <div className='text-center m-5'>
                      {loading ? (
                        <CircularProgress color='secondary' />
                      ) : (
                        <Row>
                          <Col sm='6'>
                            <Button
                              variant='contained'
                              color='success'
                              onClick={() => {
                                var img = new Image()
                                img.src =
                                  process.env.PUBLIC_URL + '/background.jpg'

                                doc.rect('2', '2', '196', '196')
                                doc.addImage(img, 'jpeg', 3, 3, 194, 25)

                                doc.rect('15', '35', '170', '75')
                                doc.setFont('Times-Roman', 'italic')
                                doc.setTextColor(0, 77, 153)
                                doc.text('Name ', 30, 55)
                                doc.text('Medical ID ', 30, 65)
                                doc.text('Prediction ', 30, 75)

                                doc.setFont('Times-Roman', 'normal')
                                doc.setTextColor(0, 0, 0)
                                doc.text(`: ${name} `, 60, 55)
                                doc.text(`: ${medicalID} `, 60, 65)
                                doc.text(
                                  `: ${(prediction * 100).toFixed(2)} %`,
                                  60,
                                  75
                                )

                                doc.addImage(
                                  imageSource,
                                  'jpeg',
                                  125,
                                  45,
                                  50,
                                  50
                                )
                                doc.setFont('Times-Roman', 'normal')
                                // doc.setTextColor(0, 102, 82)
                                doc.text(`${file.name}`, 130, 100)

                                doc.save(`${medicalID}.pdf`)
                              }}
                            >
                              Download Report
                            </Button>
                          </Col>
                          <Col sm='6'>
                            <Button
                              variant='contained'
                              color='danger'
                              onClick={() => {
                                toggleForm(true)
                                setFile(null)
                                setName(null)
                                setMedicalID(null)
                                setPrediction(null)
                                setImageSource(null)
                              }}
                            >
                              Predict Another
                            </Button>
                          </Col>
                        </Row>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col sm='3'></Col>
            </Row>
          )}
        </Fragment>
        {/* <Button
          variant='contained'
          color='info'
          onClick={() => {
            var img = new Image()
            var source = window.document.getElementById('forPdf')
            img.src = process.env.PUBLIC_URL + '/background.jpg'
            doc.rect('2', '2', '196', '196')
            doc.addImage(img, 'png', 3, 3, 194, 25)

            doc.rect('15', '35', '170', '75')
            doc.setFont('Times-Roman', 'italic')
            doc.setTextColor(0, 77, 153)
            doc.text('Name ', 30, 55)
            doc.text('Medical ID ', 30, 65)
            doc.text('Name ', 30, 75)
            doc.text('Medical ID ', 30, 85)

            doc.setFont('Times-Roman', 'normal')
            doc.setTextColor(0, 0, 0)
            doc.text(': Anuragh ', 60, 55)
            doc.text(': ISIC_6873268623 ', 60, 65)
            doc.text(': Anuragh ', 60, 75)
            doc.text(': ISIC_6873268623 ', 60, 85)

            doc.addImage(img, 'png', 125, 45, 50, 50)
            doc.setFont('Times-Roman', 'normal')
            // doc.setTextColor(0, 102, 82)
            doc.text('ISIC_6873268623 ', 130, 100)

            doc.save('demo.pdf')
          }}
        >
          Download Report
        </Button> */}
      </Container>
    </Fragment>
  )
}

export default Main
