import React, { useEffect, useRef, useState } from "react";
import logo from "./assets/tvs-lucas-logo.png";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedIcon from "@mui/icons-material/Verified";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector, useDispatch } from "react-redux";
import { adminSelector } from "./redux/slice/adminSlice";
import {
  connectedDeviceApi,
  VerifiedListApi,
} from "./redux/action/adminAction";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MonitorIcon from "@mui/icons-material/Monitor";
import CommonDropdown from "./components/common/commonDropDown";
import { showToast } from "./components/Toast/toastService";

const Home = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedValue, setSelectedValue] = useState("");
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [partsStatus, setPartsStatus] = useState([]);
  const [OpenBtn, setOpenBtn] = useState("");
  const { verifiedPartDetail, connectedDeviceDetail } =
    useSelector(adminSelector);
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  const options = [
    { value: 10, label: "YED-26024986" },
    { value: 20, label: "PSSF-26024883A" },
  ];

  const partsList = [
    "BG_Grommet",
    "STA_Nut",
    "Terminal",
    "Lucar_Welding",
    "Connector",
    "Through_Bolt_Screw",
    "BG_Screw",
    "Fixing_Bracket_Holes",
    "Switch_Screw",
    "Vent_Plug",
    "Drive_Assembly",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString();
  };

  const handleOpen = () => {
    // Dispatch your action here to fetch parts data
  };

  // Initialize partsStatus with all parts set to not verified initially
  useEffect(() => {
    const initialPartsStatus = partsList.map((part) => ({
      name: part,
      verified: null, // Initially null to indicate no verification status
    }));
    setPartsStatus(initialPartsStatus);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement.complete) {
      setIsVideoLoading(false);
    } else {
      videoElement.onload = () => {
        setIsVideoLoading(false);
      };
    }

    // Set up an interval to fetch parts verification continuously
    const verificationInterval = setInterval(() => {
      if (!isVideoLoading) {
        dispatch(VerifiedListApi());
      }
    }, 3000); // Adjust the interval as needed

    // Cleanup the interval on component unmount
    return () => clearInterval(verificationInterval);
  }, [dispatch, isVideoLoading]);

  // Update partsStatus when verifiedPartDetail is fetched
  useEffect(() => {
    if (verifiedPartDetail?.detected_objects) {
      const updatedPartsStatus = partsList.map((part) => ({
        name: part,
        verified: verifiedPartDetail.detected_objects.includes(part),
      }));
      setPartsStatus(updatedPartsStatus);
    }
  }, [verifiedPartDetail]);

  const handleClickOk = () => {
    if (verifiedPartDetail?.not_detected_objects === 0) {
      setOpenBtn("Pass");
    } else {
      // showToast("Check Points not Verified", "error");
      setOpenBtn("error");
    }
  };

  const handleClickNotOk = () => {
    setOpenBtn("fail");
  };

  useEffect(() => {
    if (!connectedDeviceDetail) {
      dispatch(connectedDeviceApi());
    }
  }, [connectedDeviceDetail, dispatch]);

  return (
    <div>
      {/* Top Bar */}
      <div className="topBar">
        <div className="container-fluid">
          <div className="row">
            <div className="col-2">
              <img src={logo} alt="Logo" className="img-fluid" />
            </div>
            <div className="col-8">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "300px" }}>
                  <CommonDropdown
                    id="age-dropdown"
                    label="Part Number"
                    options={options}
                    value={selectedValue}
                    onOpen={handleOpen}
                    customChange={setSelectedValue}
                  />
                </div>

                <div>
                  <div className="connectedDevice">
                    <div>
                      <h6>
                        <CameraAltIcon
                          style={{
                            color:
                              connectedDeviceDetail?.camera_connected === true
                                ? "green"
                                : "grey",
                          }}
                        />
                        {connectedDeviceDetail?.camera_connected === true
                          ? "CAMERA CONNECTED"
                          : "CAMERA NOT CONNECTED"}
                      </h6>
                    </div>
                    <div>
                      <h6>
                        <MonitorIcon
                          style={{
                            color:
                              connectedDeviceDetail?.message ===
                              "PLC is connected"
                                ? "green"
                                : "grey",
                          }}
                        />
                        {connectedDeviceDetail?.plc_connected === true
                          ? "PLC CONNECTED"
                          : "PLC NOT CONNECTED"}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-2">
              <div style={{ float: "right" }}>
                <div className="dateandtime">
                  <h6 style={{ marginRight: "25px" }}>
                    <DateRangeIcon
                      style={{ marginRight: "10px", color: "#0057ac" }}
                    />
                    {formatDate(currentDateTime)}
                  </h6>
                  <h6>
                    <AccessTimeIcon
                      style={{ marginRight: "5px", color: "#0057ac" }}
                    />
                    {formatTime(currentDateTime)}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Processing Section */}
      <div className="videoProcessing">
        <div className="row">
          <div className="col-2">
            <div className="sop-card">
              <h4>Activity Check</h4>
              <div className="countList">
                <p>Total Counts: 0</p>
              </div>
              <div className="countList">
                <p style={{ color: "green", fontWeight: "600" }}>
                  Pass Counts: 0
                </p>
              </div>
              <div className="countList">
                <p style={{ color: "brown" }}>Fail Count: 0</p>
              </div>
              <div>
                <button className="newBtn">Reset</button>
              </div>
            </div>
            {/* <br /> */}
            <div className="sop-card">
              <h4>Check Points Counts</h4>

              <div className="countList">
                <p style={{ color: "green", fontWeight: "600" }}>
                  Verified Counts: 0
                </p>
              </div>
              <div className="countList">
                <p style={{ color: "brown",borderBottom:"none" }}>Not Verified Counts: 0</p>
              </div>
            </div>
            {/* <br /> */}
            <div className="visual-check">
              <h5>Visual Check Result</h5>
              <div className="selectBtn">
                <button className="ok" onClick={handleClickOk}>
                  OK
                </button>
                <button className="notok" onClick={handleClickNotOk}>
                  NOT OK
                </button>
              </div>
            </div>
            <br />
            <div className="finalResult">
              <h5>Final Result</h5>
              <div className="res">
                {OpenBtn === "" || undefined || null ? (
                  <p>Pending...</p>
                ) : OpenBtn === "Pass" ? (
                  <h5 className="pass">Pass</h5>
                ) : OpenBtn === "error" ? (
                  <span
                    style={{
                      color: "red",
                      fontWeight: "600",
                      fontSize: "18px",
                    }}
                  >
                    Please verify all checkpoints to proceed.
                  </span>
                ) : (
                  <h5 className="fail">Fail</h5>
                )}
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="videoSection">
              <div className="headTitle">
                <h4 style={{ fontSize: "20px" }}>GRS PDI VISUAL INSPECTION</h4>
              </div>
              <div className="pageContainer">
                {isVideoLoading && (
                  <div className="loadingMessage">
                    <h2>
                      Welcome to{" "}
                      <span style={{ color: "green", fontWeight: "800" }}>
                        Lucas TVS
                      </span>{" "}
                    </h2>
                    <h3>AI Video Analytics</h3>
                  </div>
                )}
                <div className="videoContainer">
                  <img
                    ref={videoRef}
                    src="http://192.168.26.52:3000/video_feed"
                    alt="Video is loading ...."
                    className="videoFeed"
                    style={{ display: isVideoLoading ? "none" : "block" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-2">
            <div className="sop-card">
              <h4>Check Points</h4>
              <div className="partsList">
                {partsStatus.map((part, i) => (
                  <p
                    key={i}
                    style={{
                      backgroundColor:
                        part.verified === null
                          ? "#bbbaba"
                          : part.verified
                          ? "#00963f"
                          : "#a93939",
                      color:
                        part.verified === null
                          ? "black"
                          : part.verified
                          ? "white"
                          : "white",
                    }}
                  >
                    {part.name}
                    {part.verified === null ? null : part.verified ? (
                      <VerifiedIcon
                        sx={{
                          color: "white",
                          marginLeft: "10px",
                          fontSize: "30px",
                          float: "right",
                        }}
                      />
                    ) : (
                      <CancelIcon
                        sx={{
                          color: "white",
                          marginLeft: "10px",
                          fontSize: "25px",
                          float: "right",
                        }}
                      />
                    )}
                  </p>
                ))}
              </div>
            </div>
            {/* <div >
              <p>
                Verfied Counts : {verifiedPartDetail?.not_detected_objects}{" "}
              </p>
              <p>
                Not Verfied Counts : {verifiedPartDetail?.not_detected_objects}
              </p>
            </div> */}

            <br />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div>
        <footer className="footer">
          <p>
            All rights reserved. Copyright © 2024{" "}
            <span style={{ color: "rgb(255, 144, 10)", fontWeight: "bold" }}>
              Video Analytics by PED-AI Team
            </span>
            .
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
