import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { Col, Container, Row,} from 'react-bootstrap';
import logo from '../../../asset/logo.png';
import './Navigation.css'

import { useSnackbar } from 'notistack';

import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../../redux/blockchain/blockchainActions";
import { fetchData } from "../../../redux/data/dataActions";

const Navigation = (props) => {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
          dispatch(fetchData(blockchain.account));
        }
    };

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const load = async () => {
            dispatch(connect());
        }
        load();
    }, []);

    useEffect(() => {
        getData();
    }, [blockchain.smartContract]);

    useEffect(() => {
        let timer = setTimeout(() => {
        getData();
      }, 60000);
    
      return () => clearTimeout(timer)
    });

    useEffect(() => {
        if (blockchain.errorMsg) {
            enqueueSnackbar(blockchain.errorMsg, { variant: 'warning' });
            // alert(blockchain.errorMsg);
        }
    }, [blockchain.errorMsg]);

    return (
        <div className='mt-5 pt-4'>

        <Container>
        <Row className='my-3'>
            <Col sm={12} md={4}>
                <div className='affiliate'>
                    <a className='affiliate-programe' href='#AffiliateProgram'>AFFILIATE PROGRAM</a>
                </div>
            </Col>
            <Col sm={12} md={4}>
                <div className='mt-sm-2'>
                <nav className='affiliate'>
                    <img src={logo} alt="" /> <span className='ico'>ICO PRESALE</span> 
                </nav>
                </div>
            </Col>
            <Col sm={12} md={4}>  
                <div className='affiliate'>
                {
                blockchain.account ? (
                    <button className='wallet-btn' onClick={null}>
                            {/* <FontAwesomeIcon icon="fa-thin fa-wallet" /> */}
                            {`${blockchain.account.slice(0, 5) + "..." + blockchain.account.slice(38)}`}
                    </button>
                ) : (
                    <button className='wallet-btn' onClick={
                        (e) => {
                            e.preventDefault();
                            dispatch(connect());
                            getData();
                        }}>
                            {/* <FontAwesomeIcon icon="fa-thin fa-wallet" /> */}
                              Connect Wallet
                    </button>
                )
                }
                </div>
            </Col>
        </Row>
        </Container>

        </div>
    );
};

export default Navigation;