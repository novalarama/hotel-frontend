import {useState, useEffect} from "react";
import axios from "axios";
import Navbar from "../components/Navbar"


export default function DashboardHotel() {
    return <div className="row col-lg-12">
        <div className="col-lg-2 mt-4"><Navbar/></div>
        <div className="col-lg-7 mt-4">
            <div className="ms-4 me-2 cardContent">
                <div className="p-4">
                    <h1 className="fw-bold">Welcome, Noval!</h1>
                    <h5 className="mb-4">You have some guest right now</h5>
                    <div className="col-md-12 row mb-4">
                        <div className="col-md-6">
                            <div className="cardC1 p-4">
                                <p className="textC2 fw-bold text-center">22</p>
                                <h5 className="text-center">Accessible's Room Guest</h5>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="cardC2 p-4">
                            <p className="textC2 fw-bold text-center">12</p>
                                <h5 className="text-center">Luxury's Room Guests</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 row mb-4">
                        <div className="col-md-6">
                            <div className="cardC3 p-4">
                            <p className="textC2 fw-bold text-center">9</p>
                                <h5 className="text-center">Suite's Room Guests</h5>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="cardC4 p-4">
                            <p className="textC2 fw-bold text-center">0</p>
                                <h5 className="text-center">Executive's Room Guests</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 row">
                        <div className="col-md-4">
                            <div className="cardC5 p-4">
                            <p className="textC2 fw-bold text-center">2</p>
                                <h5 className="text-center">Family's Room Guests</h5>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="cardC6 p-4">
                            <p className="textC2 fw-bold text-center">1</p>
                                <h5 className="text-center">Deluxe's Room Guests</h5>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="cardC7 p-4">
                            <p className="textC2 fw-bold text-center">1</p>
                                <h5 className="text-center">Ordinary's Room Guests</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-lg-3 mt-4 cardContent">
            <div className="m-4">
                <h1>Hello</h1>
            </div>
        </div>
    </div>
}
