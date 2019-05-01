import React from 'react';
import { Modal, ModalHeader, ModalBody, FormGroup, Label, } from 'reactstrap';

const photos = [
    { src: 'images/ancient-aliens.jpg' },
    { src: 'images/ned.jpg' },
    { src: 'images/tapping-head.jpg' },
    { src: 'images/waiting-skeleton.jpg' },
    { src: 'images/x-x-everywhere.jpg' },
    { src: 'images/drake.jpg' },
    { src: 'images/expanding-brain.jpg' },
    { src: 'images/hard-choice.jpg' },
    { src: 'images/car-turning.jpg' },
    { src: 'images/masters-blessing.jpg' },
    { src: 'images/copy.jpg' },
    { src: 'images/gru.jpg' },
    { src: 'images/is-this-a-bird.jpg' },
    // .. And much more meme-templates
];

const initialState = {
    text1: "",
    text2: "",
    text3: "",
    isOneDragging: false,
    isTwoDragging: false,
    isThreeDragging: false,
    oneY: "10%",
    oneX: "50%",
    twoX: "50%",
    twoY: "50%",
    threeX: "50%",
    threeY: "90%",
}

class MainPage extends React.Component {
    constructor() {
        super();
        this.state = {
            currentImage: 0,
            modalIsOpen: false,
            currentImagebase64: null,
            ...initialState
        };
    }

    openImage = (index) => {
        const image = photos[index];
        const base_image = new Image();
        base_image.src = image.src;
        const base64 = this.getBase64Image(base_image);
        this.setState(prevState => ({
            currentImage: index,
            modalIsOpen: !prevState.modalIsOpen,
            currentImagebase64: base64,
            ...initialState
        }));
    }

    toggle = () => {
        this.setState(prevState => ({
            modalIsOpen: !prevState.modalIsOpen
        }));
    }

    changeText = (event) => {
        this.setState({
            [event.currentTarget.name]: event.currentTarget.value
        });
    }

    getStateObj = (e, type) => {
        let rect = this.imageRef.getBoundingClientRect();
        const xOffset = e.clientX - rect.left;
        const yOffset = e.clientY - rect.top;
        let stateObj = {};
        if (type === "one") {
            stateObj = {
                isOneDragging: true,
                isTwoDragging: false,
                isThreeDragging: false,
                oneX: `${xOffset}px`,
                oneY: `${yOffset}px`
            }
        } else if (type === "two") {
            stateObj = {
                isOneDragging: false,
                isTwoDragging: true,
                isThreeDragging: false,
                twoX: `${xOffset}px`,
                twoY: `${yOffset}px`
            }

        } else if (type === "three") {
            stateObj = {
                isOneDragging: false,
                isTwoDragging: false,
                isThreeDragging: true,
                threeX: `${xOffset}px`,
                threeY: `${yOffset}px`
            }
        }
        return stateObj;
    }

    handleMouseDown = (e, type) => {
        const stateObj = this.getStateObj(e, type);
        document.addEventListener('mousemove', (event) => this.handleMouseMove(event, type));
        this.setState({
            ...stateObj
        })
    }

    handleMouseMove = (e, type) => {
        if (this.state.isOneDragging || this.state.isTwoDragging || this.state.isThreeDragging) {
            let stateObj = {};
            if (type === "three" && this.state.isThreeDragging) {
                stateObj = this.getStateObj(e, type);
            } else if (type === "one" && this.state.isOneDragging) {
                stateObj = this.getStateObj(e, type);
            } else if (type === "two" && this.state.isTwoDragging) {
                stateObj = this.getStateObj(e, type)
            }
            this.setState({
                ...stateObj
            });
        }
    };

    handleMouseUp = (event) => {
        document.removeEventListener('mousemove', this.handleMouseMove);
        this.setState({
            isOneDragging: false,
            isTwoDragging: false,
            isThreeDragging: false
        });
    }

    convertSvgToImage = () => {
        const svg = this.svgRef;
        let svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        canvas.setAttribute("id", "canvas");
        const svgSize = svg.getBoundingClientRect();
        canvas.width = svgSize.width;
        canvas.height = svgSize.height;
        const img = document.createElement("img");
        img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
        img.onload = function () {
            canvas.getContext("2d").drawImage(img, 0, 0);
            const canvasdata = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.download = "meme.png";
            a.href = canvasdata;
            document.body.appendChild(a);
            a.click();
        };
    }

    getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
    }

    textToSpan(text, x) {
        const substrings = text.split("\n");
        // Taken from https://stackoverflow.com/a/16701952/677910
        return substrings.map((s, index) => (
            <tspan key={s + index} x={x} dy={index === 0 ? 0 : "1.2em"}>{s}</tspan>
        ));
    }

    render() {
        const image = photos[this.state.currentImage];
        const base_image = new Image();
        base_image.src = image.src;
        // || 1 to fix division by zero before image was loaded
        var wrh = base_image.width / base_image.height || 1;
        var newWidth = 600;
        var newHeight = newWidth / wrh;
        const textStyle = {
            fontFamily: "Impact",
            fontSize: "30px",
            textTransform: "uppercase",
            fill: "#FFF",
            stroke: "#000",
            userSelect: "none"

        }

        return (
            <>
                <div className="main-content">
                    <div className="content">
                        {photos.map((image, index) => (
                            <div className="image-holder" key={image.src}>

                                <img
                                    style={{
                                        width: "100%",
                                        cursor: "pointer",
                                        height: "100%"
                                    }}
                                    alt={index}
                                    src={image.src}
                                    onClick={() => this.openImage(index)}
                                    role="presentation"
                                />

                            </div>
                        ))}
                    </div>
                </div>
                <Modal className="meme-gen-modal" isOpen={this.state.modalIsOpen}>
                    <ModalHeader toggle={this.toggle}>Create your own meme</ModalHeader>
                    <ModalBody>
                        <svg
                            width={newWidth}
                            id="svg_ref"
                            height={newHeight}
                            ref={el => { this.svgRef = el }}
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink">
                            <image
                                ref={el => { this.imageRef = el }}
                                xlinkHref={this.state.currentImagebase64}
                                height={newHeight}
                                width={newWidth}
                            />
                            <text
                                style={{ ...textStyle, zIndex: this.state.isOneDragging ? 4 : 1 }}
                                x={this.state.oneX}
                                y={this.state.oneY}
                                dominantBaseline="middle"
                                textAnchor="middle"
                                onMouseDown={event => this.handleMouseDown(event, 'one')}
                                onMouseUp={event => this.handleMouseUp(event, 'one')}
                                className="display-linebreak"
                            >
                                {this.textToSpan(this.state.text1, this.state.oneX)}
                            </text>
                            <text
                                style={textStyle}
                                dominantBaseline="middle"
                                textAnchor="middle"
                                x={this.state.twoX}
                                y={this.state.twoY}
                                onMouseDown={event => this.handleMouseDown(event, 'two')}
                                onMouseUp={event => this.handleMouseUp(event, 'two')}
                            >
                                {this.textToSpan(this.state.text2, this.state.twoX)}
                            </text>
                            <text
                                style={textStyle}
                                dominantBaseline="middle"
                                textAnchor="middle"
                                x={this.state.threeX}
                                y={this.state.threeY}
                                onMouseDown={event => this.handleMouseDown(event, 'three')}
                                onMouseUp={event => this.handleMouseUp(event, 'three')}
                            >
                                {this.textToSpan(this.state.text3, this.state.threeX)}
                            </text>
                        </svg>
                        <div className="meme-form">
                            <FormGroup>
                                <Label for="text1">Text 1</Label>
                                <textarea className="form-control" type="text" name="text1" id="text1" placeholder="Add text and drag it around" rows={3} onChange={this.changeText} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="text2">Text 2</Label>
                                <textarea className="form-control" type="text" name="text2" id="text2" placeholder="Add text and drag it around" rows={3} onChange={this.changeText} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="text3">Text 3</Label>
                                <textarea className="form-control" type="text" name="text3" id="text3" placeholder="Add text and drag it around" rows={3} onChange={this.changeText} />
                            </FormGroup>
                            <button onClick={() => this.convertSvgToImage()} className="btn btn-primary">Download Meme!</button>
                        </div>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

export default MainPage;