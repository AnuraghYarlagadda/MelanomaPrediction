import React, { useState, Fragment } from 'react'
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
} from 'reactstrap'

const Main = () => {
  const [uploadInput, setuploadInput] = useState('')
  const handleUploadImage = async (ev) => {
    ev.preventDefault()
    const data = new FormData()
    data.append('file', uploadInput.files[0])

    await axios.post('http://127.0.0.1:5000/upload', data, {}).then((res) => {
      // then print response status
      console.log(res)
    })
  }

  return (
    <Fragment>
      <Container>
        <Row>
          <Col sm='3'></Col>
          <Col sm='6'>
            <div className='text-center'>
              <Card>
                <CardBody>
                  <form onSubmit={handleUploadImage}>
                    <div>
                      <input
                        ref={(ref) => {
                          setuploadInput(ref)
                        }}
                        type='file'
                      />
                    </div>
                    <br />
                    <div>
                      <Button variant='contained' color='primary'>
                        Upload
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </div>
          </Col>
          <Col sm='3'></Col>
        </Row>
      </Container>
    </Fragment>
  )
}

export default Main
