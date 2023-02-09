import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const Videos = () => {
    return (
        <div>
           <Container>
               <div className='mt-5 mb-5'>
               <Row>
                    <Col sm={12}  lg={4}>
                      <div>
                        <video
                        id="video"
                        // ref={videoRef}
                        src="http://www.w3schools.com/html/mov_bbb.mp4"
                        type="video/mp4"
                        controls>
                        </video>
                        </div>
                    </Col>
                    <Col sm={12}  lg={4}>
                        <div>
                        <video
                        id="video"
                        // ref={videoRef}
                        src="http://www.w3schools.com/html/mov_bbb.mp4"
                        type="video/mp4"
                        controls>
                        </video>
                        </div>
                    </Col>
                    <Col sm={12}  lg={4}>
                        <div>
                        <video
                        id="video"
                        // ref={videoRef}
                        src="http://www.w3schools.com/html/mov_bbb.mp4"
                        type="video/mp4"
                        controls>
                        </video>
                        </div>
                    </Col>
                   
                </Row>

               </div>
            </Container> 
        </div>
    );
};

export default Videos;