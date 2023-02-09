import React from 'react';
import { Container, ProgressBar } from 'react-bootstrap';
import cIco from '../../../asset/Crinet Logo_Icon.png'
import gIco from '../../../asset/clarity_users-outline-alerted.png'
import './SeedPhase.css'

const SeedPhase = () => {
    return (
        <section className='banar-section'>
            <div className='wrapper'>
            </div>
            <Container>
                <div className='seed-card'>
                    <div className='text-white lh-1 pt-3'>
                        <h3>SEED PHASE</h3>
                        <p>Private Sales</p>
                    </div>
                    <button className='btn-filed' disabled={true}>FILLED</button>
                    <div align="center">
                        {/* <div  className='bold-line'></div> */}
                        <ProgressBar now={100} label='100%' variant="info"></ProgressBar>
                    </div>
                    <div className='private-bnb'>
                        <p><strong>0 BUSD</strong></p>
                        <p><strong>150,000 BUSD</strong></p>
                    </div>

                    {/* -------------filled in// */}

                   <div>
                       <h2 className='text-white trig-text'>FILLED IN</h2>
                   <div className='field-in'>
                        <div className='invest-cnt'>
                        <div></div>
                            <img src={cIco} alt="" />
                            <div className='text-start ps-1'>
                                <span className='calculation-box'>1 CNT</span>
                                <h6>$0.005</h6>
                            </div>    
                        </div>
                        <div className='timing'>
                            <div className='time'> <h3>4</h3><h6>min</h6></div>
                            <div className='time'> <h3>46</h3><h6>sec</h6></div>   
                        </div>
                        <div className='invest-cnt'>
                            <div></div>
                            <div className='text-end pe-1'>
                                <span className='calculation-box'>Total Investors</span>
                                <h6>129</h6>
                            </div>
                           <div><img className='w-100' src={gIco} alt="" /></div>
                        </div>
                    </div>
                   </div>
                </div>
            </Container>
        </section>
    );
};

export default SeedPhase;