import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import './AffiliateProgram.css'
import '../PublicPresales/PublicPresales.css'
import { useSelector } from "react-redux";

const AffiliateProgram = () => {
    const blockchain = useSelector((state) => state.blockchain);

    return (
        <div>
           <Container>
              <div id='AffiliateProgram'>
                <div className='public-heading lh-1 pt-3'>
                        <h3>AFFILIATE PROGRAM</h3>   
                </div>
              <h5 className='text-secondary'>Your Referral Link: <br />
                <code>{blockchain.account ? window.location.origin + '?r=' + blockchain.account : '(Please connect to MetaMask to get your referral link)'}</code>
              </h5>
              
              <div style={{paddingLeft: '2%', paddingRight: '2%'}}>
              <Row>
                <Col sm={6} lg={3}>
                    <div className='aff-card'>
                        <h5>LEVEL 1</h5>
                        <p>Bring 1-3 investors</p>
                        <p>Earn 2% of their investment directly to your wallet</p>
                    </div>
                </Col>
                <Col sm={6} lg={3}>
                    <div className='aff-card'>
                        <h5>LEVEL 2</h5>
                        <p>Bring 4-9 investors</p>
                        <p>Earn 2.5% of their investment directly to your wallet</p>
                    </div>
                </Col>
                <Col sm={6} lg={3}>
                    <div className='aff-card'>
                        <h5>LEVEL 3</h5>
                        <p>Bring 10-24 investors</p>
                        <p>Earn 3% of their investment directly to your wallet</p>
                    </div>
                </Col>
                <Col sm={6} lg={3}>
                    <div className='aff-card'>
                        <h5>LEVEL 4</h5>
                        <p>Bring 25+ investors</p>
                        <p>Earn 4% of their investment directly to your wallet</p>
                    </div>
                </Col>
            </Row>
              </div>
              </div>
              {/* <div>
              <button className='affiliate-btn'>AFFILIATE PROGRAM GUIDE</button>
              </div> */}
           </Container>
        </div>
    );
};

export default AffiliateProgram;