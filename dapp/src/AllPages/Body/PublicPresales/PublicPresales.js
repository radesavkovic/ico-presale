import React, { useEffect, useState } from 'react';
import { Col, Row, ProgressBar, Container } from 'react-bootstrap';
import pIco from '../../../asset/Crinet Logo_Icon_purpol.png'
import inPurple from '../../../asset/invisitor-purple.png'
import bxtime from '../../../asset/bx_time.png'
import './PublicPresales.css'
import BuyDlg from '../../Modal/BuyDlg';

//
import cIco from '../../../asset/Crinet Logo_Icon.png'
import gIco from '../../../asset/clarity_users-outline-alerted.png'
import '../SeedPhase/SeedPhase.css'
//
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../../redux/data/dataActions";
import Web3 from "web3";


const PublicPresales = () => {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    let web3 = new Web3(window.ethereum);

    const { enqueueSnackbar } = useSnackbar();

    const [show, setShow] = useState(false);

    const [deadline, countDown] = useState({});

    const [claimableAmount, setClaimableAmount] = useState(0);

    const handleClose = () => {
        setShow(false);
    }

    async function UpdateClaimAmount() {
        if (blockchain.account && blockchain.smartContract) {
            let amount;
            amount = await blockchain.smartContract.methods.claimableAmounts(blockchain.account).call();
            setClaimableAmount(amount);
        }
    }

    // useEffect(() => {
    //     const load = async () => {
    //         dispatch(connectToContract());
    //     }
    //     load();
    // }, []);

    function getDays(time) {
        return Math.floor(time / (1000 * 60 * 60 * 24));
    }

    function getHours(time) {
        return Math.floor((time / (1000 * 60 * 60)) % 24);
    }

    function getMinutes(time) {
        return Math.floor((time / 1000 / 60) % 60);
    }

    function getSeconds(time) {
        return Math.floor((time / 1000) % 60);
    }

    const numberFormatter = Intl.NumberFormat('en-US');

    let timer = null;
    function leading0(num) {
        return num < 10 ? "0" + num : num;
    }
    function getTimeUntil(d) {
        const dnow = new Date();
        const time = d - dnow;
        if (isNaN(time) || time < 0) {
            countDown({ days: 0, hours: 0, minutes: 0, seconds: 0});
            if (timer) {
                clearInterval(timer);
            }
        } else {
            const seconds = getSeconds(time);
            const minutes = getMinutes(time);
            const hours = getHours(time);
            const days = getDays(time);
            countDown({ days:days, hours:hours, minutes:minutes, seconds:seconds });
        }
    }
    
    useEffect(() => {
        const d = new Date(1647795600000); //20th March 2022 at 5PM UTC
        getTimeUntil(d);
        timer = setInterval(() => {
            getTimeUntil(d);
        }, 1000);
    }, []);

    useEffect(() => {
        UpdateClaimAmount();
    }, [blockchain.account]);


    const handleSubmit = (value) => {
        const load = async () => {
            try {
                await blockchain.busdContract.methods
                    .approve(blockchain.smartContract._address, web3.utils.toWei(value.toString(), 'ether'))
                    .send({ from: blockchain.account });

                const separator = 'r=';
                const offset = separator.length;
                const href = window.location.href;
                const begin = href.indexOf(separator) + offset;
                let addrStr = href.slice(begin, begin + 42);
                const addrNull = '0x0000000000000000000000000000000000000000';
                if (addrStr && web3.utils.isAddress(addrStr)) {
                    if (addrStr == blockchain.account) {
                        addrStr = addrNull;
                    }
                } else {
                    addrStr = addrNull;
                }

                await blockchain.smartContract.methods
                    .buyTokens(web3.utils.toWei(value.toString(), 'ether'), addrStr)
                    .send({ from: blockchain.account });
                
                dispatch(fetchData());

                UpdateClaimAmount();

                enqueueSnackbar('You have successfully purchased $CNT', { variant: 'success' });
            } catch (err) {
                enqueueSnackbar('Transaction has been failed', { variant: 'error' });
            }
        }
        load();

        setShow(false);
    }
    async function buyToken() {
        if (blockchain.account) {
            setShow(true);
        } else {
            enqueueSnackbar("Please connect to MetaMask", { variant: 'warning' });
        }
    }

    async function claimToken() {
        if (blockchain.account) {
            await blockchain.smartContract.methods
            .claimTokens()
            .send({ from: blockchain.account });
        } else {
            enqueueSnackbar("Please connect to MetaMask", { variant: 'warning' });
        }

    }

    const FilledCard = (props) => {
        return (
            <Container>
                <div className='seed-card' style={{marginTop: '1.5rem', marginBottom: '1.5rem', top: 'unset'}}>
                    <div className='text-white lh-1 pt-3'>
                        <h3>PUBLIC PRESALE</h3>
                        <p>ICO Round #{props.roundNumber}</p>
                    </div>
                    <button className='btn-filed' disabled={true}>FILLED</button>
                    <div align="center">
                        {/* <div  className='bold-line'></div> */}
                        <ProgressBar now={100} label='100%' variant="info"></ProgressBar>
                    </div>
                    <div className='private-bnb'>
                        <p><strong>0 BUSD</strong></p>
                        <p><strong>{props.hardCap} BUSD</strong></p>
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
                                <h6>${props.price}</h6>
                            </div>    
                        </div>
                        <div className='timing'>
                            <div className='time'> <h3>{getDays(props.period * 1000)}</h3><h6>days</h6></div>
                            <div className='time'> <h3>{getHours(props.period * 1000)}</h3><h6>hours</h6></div>   
                        </div>
                        <div className='invest-cnt'>
                            <div></div>
                            <div className='text-end pe-1'>
                                <span className='calculation-box'>Total Investors</span>
                                <h6>{props.investors}</h6>
                            </div>
                        <div><img className='w-100' src={gIco} alt="" /></div>
                        </div>
                    </div>
                </div>
                </div>
            </Container>
        );
    }
    
    return (
        <div className='mt-5 pt-4'>
            <BuyDlg show={show} handleClose={handleClose} handleSubmit={handleSubmit} price={data.cntPrice}></BuyDlg>

            {/*----------------------------------- Round one/// */}
            {parseInt(data.activeRound) == 0 ?
                <div className='container'>
                <div className='presales-card'>
                    <div className='lh-1 pt-3'>
                        <div className='public-heading'>
                            <h3> PUBLIC PRESALE</h3>
                            <p>ICO Round #1</p>
                        </div>
                    </div> 
                    <button className='upcoming-btn' disabled={true}>UPCOMING</button>
                    <div align="center">
                        <ProgressBar>
                        </ProgressBar>
                    </div>
                    <div className='private-bnb text-dark'>
                        <p><strong>0 BUSD</strong></p>
                        <p>
                            <strong>500,000 BUSD</strong> <br />
                            <button className='hard-cup' disabled={true}>HARD CAP FOR ROUND 1 : 500,000 BUSD</button>
                        </p>
                    </div>
                    <div className='public-bycnt'>
                        <Row className='mx-auto'>
                            <Col sm={12} md={4} className='roundOne pt-0'>
                                <div className='roundOneUSD'>
                                    <div className='me-3'>
                                        <div className='d-flex'>
                                            <img src={pIco} alt="" />
                                            <div className='text-start ps-2'>
                                                <span className='text-secondary'>1 CNT</span>
                                                <h6 style={{ fontWeight: '800' }}>$0.0075</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={12} md={4} style={{opacity: '1'}}>
                            <div className='d-flex mb-4' style={{justifyContent: 'center'}}>
                                    <div className='text-start ms-2'>
                                        <h5 className='text-secondary' style={{textAlign: 'center'}}>Round #1 starts in:</h5>
                                        <h4 style={{fontWeight: '800', textAlign: 'center'}}>
                                            {leading0(deadline.days)}d&nbsp;
                                            {leading0(deadline.hours)}h&nbsp;
                                            {leading0(deadline.minutes)}m&nbsp; 
                                            {leading0(deadline.seconds)}s
                                        </h4>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={12} md={4} className='roundOne pt-0'>
                                <div>
                                    <div>
                                        <div className='total-invisitor'>
                                            <img src={inPurple} alt="" />
                                            <div className='text-start ps-2'>
                                                <span className='text-secondary'>Total Investors</span>
                                                <h6 style={{ fontWeight: '800' }}>0</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            :
            parseInt(data.activeRound) > 1 ?
                <FilledCard 
                    roundNumber={1} 
                    hardCap={`${numberFormatter.format(web3.utils.fromWei(data.roundInfo1['hardCap'].toString(), 'ether'))}`}
                    price={data.roundInfo1['cntPrice'] / 10000}
                    investors={Number(data.investors1)}
                    period={data.roundInfo1['endTime'] - data.roundInfo1['startTime']}>
                </FilledCard>
            :
                <div className='container'>
                    <div className={data.activeRound == '1' ? 'presales-card live-section' : 'presales-card'}>
                        <div className='lh-1 pt-3'>
                            <div className='public-heading'>
                                <h3> PUBLIC PRESALE</h3>
                                <p>ICO Round #1</p>
                            </div>
                        </div> 
                        {parseInt(data.activeRound) < 1 ? 
                        <button className='upcoming-btn' disabled={true}>UPCOMING</button>
                        : parseInt(data.activeRound) == 1 && <button className='presales-btn' disabled={true}>LIVE</button>
                        }
                        <div align="center">
                            <ProgressBar 
                                now={web3.utils.fromWei(data.busdAmount1.toString(), 'ether')} 
                                label={data.roundInfo1 && `${Math.floor(data.busdAmount1 / data.roundInfo1['hardCap'] * 100)} %`/*+ &nbsp;*/} 
                                max={data.roundInfo1 && web3.utils.fromWei(data.roundInfo1['hardCap'].toString(), 'ether')}>
                            </ProgressBar>
                        </div>
                        <div className='private-bnb text-dark'>
                            <p><strong>0 BUSD</strong></p>
                            <p>
                                <strong>{data.roundInfo1 && `${ numberFormatter.format(web3.utils.fromWei(data.roundInfo1['hardCap'].toString(), 'ether'))}`} BUSD</strong> <br />
                                <button className='hard-cup' disabled={true}>HARD CAP FOR ROUND 1 : {data.roundInfo1 && `${ numberFormatter.format(web3.utils.fromWei(data.roundInfo1['hardCap'].toString(), 'ether'))}`} BUSD </button>
                            </p>
                        </div>
                        <div className='public-bycnt'>
                            <Row className='mx-auto'>
                                <Col sm={12} md={4}>
                                    <div className='roundOneUSD'>
                                        <div className='me-3'>
                                            <div className='d-flex'>
                                                <img src={pIco} alt="" />
                                                <div className='text-start ps-2'>
                                                    <span className='text-secondary'>1 CNT</span>
                                                    <h6 style={{ fontWeight: '800' }}>${data.roundInfo1 && data.roundInfo1['cntPrice'] / 10000}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <div className='total-invisitor'>
                                                    <img src={inPurple} alt="" />
                                                    <div className='text-start ps-2'>
                                                        <span className='text-secondary'>Total Investors</span>
                                                        <h6 style={{ fontWeight: '800' }}>{Number(data.investors1)}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={12} md={4}>
                                {data.activeRound == '1' &&
                                    <div>
                                        <button className='buyUsdt-btn' onClick={buyToken}><p>BUY CNT</p></button>
                                    </div>
                                }
                                </Col>
                                <Col sm={12} md={4} className='roundOne pt-0'>
                                    <div className='d-flex mb-4' style={{marginTop: '20px'}}>
                                        <div><img style={{ width: '40px', height: '40px'}} src={bxtime} alt="" /></div>
                                        { parseInt(data.activeRound) == 1 ?
                                            <div className='text-start ms-2'>
                                                <span className='text-secondary'>Round #1 ends</span>
                                                <h6 className='text-secondary'>when Hard Cap is reached</h6>
                                            </div>
                                            : parseInt(data.activeRound) > 1 ?
                                            <div className='text-start ms-2'>
                                                <span className='text-secondary'>Round #1</span>
                                                <h6 style={{fontWeight: '800'}}>FILLED</h6>
                                            </div>
                                            :
                                            <div className='text-start ms-2'>
                                                <span className='text-secondary'>Round #1 starts in...</span>
                                                <h6 style={{fontWeight: '800'}}>18 days</h6>
                                            </div>
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            }

            {/* ------------------------------------------//Round two */}
            {parseInt(data.activeRound) > 2 ?
                <FilledCard 
                    roundNumber={2} 
                    hardCap={`${numberFormatter.format(web3.utils.fromWei(data.roundInfo2['hardCap'].toString(), 'ether'))}`}
                    price={data.roundInfo2['cntPrice'] / 10000}
                    investors={Number(data.investors2)}
                    period={data.roundInfo2['endTime'] - data.roundInfo2['startTime']}>
                </FilledCard>
            :
            <div className='container'>
                <div className={data.activeRound == '2' ? 'presales-card mt-4 mb-4 live-section' : 'presales-card mt-4 mb-4'}>
                    <div className='lh-1 pt-3'>
                        <div className='public-heading'>
                            <h3>PUBLIC PRESALE</h3>
                            <p>ICO Round #2</p>
                        </div>
                    </div>
                    {parseInt(data.activeRound) < 2 ? 
                    <button className='upcoming-btn' disabled={true}>UPCOMING</button>
                    : parseInt(data.activeRound) == 2 && <button className='presales-btn' disabled={true}>LIVE</button>
                    }
                    <div align="center">
                        <ProgressBar
                            now={web3.utils.fromWei(data.busdAmount2.toString(), 'ether')} 
                            label={data.roundInfo2 && `${Math.floor(data.busdAmount2 / data.roundInfo2['hardCap'] * 100)} %`/*+ &nbsp;*/} 
                            max={data.roundInfo2 && web3.utils.fromWei(data.roundInfo2['hardCap'].toString(), 'ether')}>     
                        </ProgressBar>
                    </div>
                    <div className='private-bnb text-dark'>
                        <p><strong>0 BUSD</strong></p>
                        <p>
                            <strong>{data.roundInfo2 && `${ numberFormatter.format(web3.utils.fromWei(data.roundInfo2['hardCap'].toString(), 'ether'))}`} BUSD</strong> <br />
                            <button className='hard-cup' disabled={true}>HARD CAP FOR ROUND 2 : {data.roundInfo2 && `${ numberFormatter.format(web3.utils.fromWei(data.roundInfo2['hardCap'].toString(), 'ether'))}`} BUSD </button>
                        </p>
                    </div>
                    <div className='public-bycnt'>
                        <Row className='mx-auto my-2'>
                            <Col sm={12} md={4}>
                                <div className='roundOneUSD'>
                                    <div className='me-3'>
                                        <div className='d-flex'>
                                            <img src={pIco} alt="" />
                                            <div className='text-start ps-2'>
                                                <span className='text-secondary'>1 CNT</span>
                                                <h6 style={{ fontWeight: '800' }}>${data.roundInfo2 && data.roundInfo2['cntPrice'] / 10000}</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <div className='total-invisitor'>
                                                <img src={inPurple} alt="" />
                                                <div className='text-start ps-2'>
                                                    <span className='text-secondary'>Total Investors</span>
                                                    <h6 style={{ fontWeight: '800' }}>{Number(data.investors2)}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={12} md={4}>
                            {data.activeRound == '2' &&
                                <div>
                                    <button className='buyUsdt-btn' onClick={buyToken}><p>BUY CNT</p></button>
                                </div>
                            }
                            </Col>
                            <Col sm={12} md={4} className='roundOne pt-0'>
                                <div className='d-flex' style={{marginTop: '20px'}}>
                                    <div><img style={{ width: '40px', height: '40px'}} src={bxtime} alt="" /></div>
                                    {
                                        parseInt(data.activeRound) < 2 ? 
                                        <div className='text-start ms-2'>
                                            <span className='text-secondary'>Round #2 starts</span>
                                            <h6 className='text-secondary'>when Round #1 Hard Cap is reached</h6>
                                        </div>
                                        : parseInt(data.activeRound) == 2 ?
                                        <div className='text-start ms-2'>
                                            <span className='text-secondary'>Round #2 ends</span>
                                            <h6 className='text-secondary'>when Hard Cap is reached</h6>
                                        </div>
                                        :
                                        <div className='text-start ms-2'>
                                            <span className='text-secondary'>Round #2</span>
                                            <h6 style={{fontWeight: '800'}}>FILLED</h6>
                                        </div>
                                    }
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            }
            {/* //-----------------------------------Round three */}
            {parseInt(data.activeRound) > 3 ?
                <FilledCard 
                    roundNumber={3} 
                    hardCap={`${numberFormatter.format(web3.utils.fromWei(data.roundInfo1['hardCap'].toString(), 'ether'))}`}
                    price={data.roundInfo2['cntPrice'] / 10000}
                    investors={Number(data.investors3)}
                    period={data.roundInfo3['endTime'] - data.roundInfo3['startTime']}>
                </FilledCard>
            :
            <div className='container'>
                <div className={data.activeRound == '3' ? 'presales-card mt-4 mb-4 live-section' : 'presales-card mt-4 mb-4'}>
                    <div className='lh-1 pt-3'>
                        <div className='public-heading'>
                            <h3>PUBLIC PRESALE</h3>
                            <p>ICO Round #3</p>
                        </div>
                    </div>
                    {parseInt(data.activeRound) < 3 ? 
                    <button className='upcoming-btn' disabled={true}>UPCOMING</button>
                    : parseInt(data.activeRound) == 3 && <button className='presales-btn' disabled={true}>LIVE</button>
                    }
                    <div align="center">
                        <ProgressBar 
                        now={web3.utils.fromWei(data.busdAmount3.toString(), 'ether')} 
                        label={data.roundInfo3 && `${Math.floor(data.busdAmount3 / data.roundInfo3['hardCap'] * 100)} %`/*+ &nbsp;*/} 
                        max={data.roundInfo3 && web3.utils.fromWei(data.roundInfo3['hardCap'].toString(), 'ether')}></ProgressBar>
                    </div>
                    <div className='private-bnb text-dark'>
                        <p><strong>0 BUSD</strong></p>
                        <p>
                            <strong>{data.roundInfo3 && `${ numberFormatter.format(web3.utils.fromWei(data.roundInfo3['hardCap'].toString(), 'ether'))}`} BUSD</strong> <br />
                            <button className='hard-cup' disabled={true}>HARD CAP FOR ROUND 3 : {data.roundInfo3 && `${ numberFormatter.format(web3.utils.fromWei(data.roundInfo3['hardCap'].toString(), 'ether'))}`} BUSD </button>
                        </p>
                    </div>
                    <div className='public-bycnt'>
                        <Row className='mx-auto my-2'>
                            <Col sm={12} md={4}>
                                <div className='roundOneUSD'>
                                    <div className='me-3'>
                                        <div className='d-flex'>
                                            <img src={pIco} alt="" />
                                            <div className='text-start ps-2'>
                                                <span className='text-secondary'>1 CNT</span>
                                                <h6 style={{ fontWeight: '800' }}>${data.roundInfo3 && data.roundInfo3['cntPrice'] / 10000}</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <div className='total-invisitor'>
                                                <img src={inPurple} alt="" />
                                                <div className='text-start ps-2'>
                                                    <span className='text-secondary'>Total Investors</span>
                                                    <h6 style={{ fontWeight: '800' }}>{Number(data.investors3)}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={12} md={4}>
                                {data.activeRound == '3' &&
                                <div>
                                    <button className='buyUsdt-btn' onClick={buyToken}><p>BUY CNT</p></button>
                                </div>
                                }

                            </Col>
                            <Col sm={12} md={4} className='roundOne pt-0'>
                                <div className='d-flex ' style={{marginTop: '20px'}}>
                                    <div><img style={{ width: '40px', height: '40px' }} src={bxtime} alt="" /></div>
                                    {
                                        parseInt(data.activeRound) < 3 ? 
                                        <div className='text-start ms-2'>
                                            <span className='text-secondary'>Round #3 starts</span>
                                            <h6 className='text-secondary'>when Round #2 Hard Cap is reached</h6>
                                        </div>
                                        : parseInt(data.activeRound) == 3 ?
                                        <div className='text-start ms-2'>
                                            <span className='text-secondary'>Round #3 ends</span>
                                            <h6 className='text-secondary'>when Hard Cap is reached</h6>
                                        </div>
                                        :
                                        <div className='text-start ms-2'>
                                            <span className='text-secondary'>Round #3</span>
                                            <h6 style={{fontWeight: '800'}}>FILLED</h6>
                                        </div>
                                    }
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            }

            {/* //-----------------------------------Claim */}
            <Container>
            <div className={data.activeRound == 4 ? 'claim-card live-claim' : 'claim-card'}>
                <div className='public-heading lh-1 pt-3'>
                    <h3>CLAIM CRINET</h3>   
                </div>
                <div className='cex-listing'>
                <Row>
                    <Col sm={12} md={4}>
                    <div className='listing-date'>
                    <div className='text-white text-start'>
                            <h6 className='text-secondary'>Your Balance Of CNT</h6>
                            <h6 style={{color: 'black', fontWeight: '800'}}>{web3.utils.fromWei(claimableAmount.toString(), 'gwei')}</h6>
                    </div>
                    </div>
    
                    </Col>
                    
                    <Col sm={12} md={4}>
                        <button className='buyUsdt-btn' onClick={claimToken}><p>Claim CNT</p></button>
                    </Col>
                    <Col sm={12} md={4}>
                    <div className='listing-date'>
                    <div className='text-white text-start'>
                            <h6 className='text-secondary'>You can claim after</h6>
                            <h6 style={{color: 'black', fontWeight: '800'}}>14/04/2022</h6>
                    </div>
                    </div>
                    </Col>
                </Row>
                </div>

            </div>
            
            </Container>
        </div>
    );
};

export default PublicPresales;