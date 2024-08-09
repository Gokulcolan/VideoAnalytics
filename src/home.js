import React, { useEffect, useRef, useState } from "react";
import logo from "./assets/tvs-lucas-logo.png";
import CommonDropdown from "./components/common/commonDropDown";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedIcon from "@mui/icons-material/Verified";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector, useDispatch } from "react-redux";
import { adminSelector } from "./redux/slice/adminSlice";
import { VerifiedListApi } from "./redux/action/adminAction";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const Home = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedValue, setSelectedValue] = useState("");
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [partsStatus, setPartsStatus] = useState([]);
  const [OpenBtn, setOpenBtn] = useState("");
  const { verifiedPartDetail } = useSelector(adminSelector);
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  const options = [
    { value: 10, label: "Ten" },
    { value: 20, label: "Twenty" },
    { value: 30, label: "Thirty" },
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
    setOpenBtn("Pass");
  };

  const handleClickNotOk = () => {
    setOpenBtn("fail");
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="topBar">
        <div className="container-fluid">
          <div className="row">
            <div className="col-4">
              <img src={logo} alt="Logo" className="img-fluid" />
            </div>
            <div className="col-4">
              <div className="row">
                <div className="col-6">
                  <CommonDropdown
                    id="age-dropdown"
                    label="Part Number"
                    options={options}
                    value={selectedValue}
                    onOpen={handleOpen}
                    customChange={setSelectedValue}
                  />
                </div>
                <div className="col-6">
                  <CommonDropdown
                    id="age-dropdown"
                    label="Variety"
                    options={options}
                    value={selectedValue}
                    customChange={setSelectedValue}
                  />
                </div>
              </div>
            </div>
            <div className="col-4">
              <div style={{ float: "right" }}>
                <div className="dateandtime">
                  <h6 style={{ marginRight: "25px" }}>
                    <DateRangeIcon
                      style={{ marginRight: "10px", color: "#ff900a" }}
                    />
                    {formatDate(currentDateTime)}
                  </h6>
                  <h6>
                    <AccessTimeIcon
                      style={{ marginRight: "5px", color: "#ff900a" }}
                    />
                    {formatTime(currentDateTime)}
                  </h6>
                </div>
                <div className="connectedDevice">
                  <div style={{ float: "right" }}>
                    <h6 style={{ marginRight: "65px" }}>
                      <RadioButtonCheckedIcon
                        style={{ marginRight: "5px", color: "green" }}
                      />
                      PLC
                    </h6>
                  </div>
                  <div>
                    <h6>
                      <RadioButtonCheckedIcon
                        style={{ marginRight: "5px", color: "grey" }}
                      />{" "}
                      CAMERA
                    </h6>
                  </div>
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
              <div className="partsList">
                <p>Total Counts: 0</p>
              </div>
              <div className="partsList">
                <p style={{ color: "green", fontWeight: "600" }}>
                  Pass Counts: 0
                </p>
              </div>
              <div className="partsList">
                <p style={{ color: "brown" }}>Fail Count: 0</p>
              </div>
              <div>
                <button className="newBtn">Reset</button>
              </div>
            </div>
            <br />
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
                ) : (
                  <h5 className="fail">Fail</h5>
                )}
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="headTitle">
              <h4 style={{ fontSize: "20px" }}>GRS PDI VISUAL INSPECTION</h4>
            </div>
            <div className="pageContainer">
              {isVideoLoading && (
                <div className="loadingMessage">
                  <h2>
                    Welcome to{" "}
                    <span style={{ color: "green", fontWeight: "800" }}>
                      Lucas TVS DRIVEN
                    </span>{" "}
                  </h2>
                  <h3>AI Video Analytics</h3>
                </div>
              )}
              <div className="videoContainer">
                <img
                  ref={videoRef}
                  src="http://192.168.43.100:3000/video_feed"
                  alt="Video Feed"
                  className="videoFeed"
                  style={{ display: isVideoLoading ? "none" : "block" }}
                />
              </div>
            </div>
          </div>
          <div className="col-2">
            <div className="sop-card">
              <h4>Check Points</h4>
              <div className="partsList">
                {partsStatus.map((part, i) => (
                  <p key={i}>
                    {part.name}
                    {part.verified === null ? null : part.verified ? (
                      <VerifiedIcon
                        sx={{
                          color: "#00953f",
                          marginLeft: "10px",
                          fontSize: "30px",
                          float: "right",
                        }}
                      />
                    ) : (
                      <CancelIcon
                        sx={{
                          color: "red",
                          marginLeft: "10px",
                          fontSize: "30px",
                          float: "right",
                        }}
                      />
                    )}
                  </p>
                ))}
              </div>
            </div>

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
