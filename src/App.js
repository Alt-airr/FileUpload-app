import React, {Component} from 'react';
import axios from 'axios';
import {Progress} from 'reactstrap';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileItem from "./FileItem";
import './css/App.css'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: [],
            loaded: 0
        }
        this.onItemDelete = this.onItemDelete.bind(this)
    }
    checkMimeType = (event) => {
        let files = event.target.files
        let err = []
        for (let x = 0; x < files.length; x++) {
            const fileType = files[x].type
            if (fileType.match('image')) {
                if (fileType.match('image/png') || fileType.match('image/jpg')) {
                    return true
                } else {
                    err[x] = files[x].type + ' is not a supported format\n';
                }
            }
        }
        for (var z = 0; z < err.length; z++) {
            toast.error(err[z])
            event.target.value = null
        }
        return true;
    }
    checkFileSize = (event) => {
        let files = event.target.files
        let size = 1000000
        let err = [];
        for (let x = 0; x < files.length; x++) {
            if (files[x].size > size) {
                err[x] = files[x].type + 'is too large, please pick a smaller file\n';
            }
        }
        for (let z = 0; z < err.length; z++) {
            toast.error(err[z])
            event.target.value = null
        }
        return true;
    }
    onChangeHandler = event => {
        let files = event.target.files
        if (this.checkMimeType(event) && this.checkFileSize(event)) {
            this.setState({
                selectedFile: Array.from(files),
                loaded: 0
            })
        }
    }
    onClickHandler = () => {
        const data = new FormData()
        if (!this.state.selectedFile.length > 0) {
            toast.error('Please, enter your file')
        } else {
            for (let x = 0; x < this.state.selectedFile.length; x++) {
                data.append('file', this.state.selectedFile[x])
            }
            axios.post("http://localhost:8000/upload", data, {
                onUploadProgress: ProgressEvent => {
                    this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
                    })
                },
            })
                .then(res => {
                    toast.success('upload success')
                })
                .catch(err => {
                    toast.error('upload fail')
                })
        }
    }
    onItemDelete(index) {
        let arr = this.state.selectedFile;
        arr.splice(index, 1);
        this.setState({selectedFile: arr});
        this.fileInput.value = null;
    }

    render() {
        let headers, selectedFiles, fileBar = null;

        if (this.state.selectedFile.length > 0){
            selectedFiles = this.state.selectedFile.map((f, index) =>
                <FileItem file={f}
                          index={index}
                          onItemDelete={this.onItemDelete}/>);

            headers = <div className='headers'>
                <div className='titleCol'>
                    Title
                </div>
                <div className='titleCol'>
                    Weight
                </div>
                <div className='titleCol'>
                    Format type
                </div>
                <div className='titleCol'>
                    Delete item
                </div>
            </div>;

            fileBar = <div><Progress max="100" color="success"
                                     value={this.state.loaded}>{Math.round(this.state.loaded, 2)}%</Progress>
                <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Submit
                </button>
            </div>
        }

        return (
            <div className="app-wrapper">
                <div className="container">
                    <div className="inpt">
                        <div className="form-group">
                            <input type="file" name="file" id="file" className="input-file" ref={(input) => {
                                this.fileInput = input
                            }} multiple onChange={this.onChangeHandler}/>
                            <label htmlFor="file" className="btn btn-tertiary js-labelFile">
                                <i className="icon fa fa-check"></i>
                                <span className="js-fileName">Upload file</span>
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <ToastContainer/>
                        {headers}
                        <div className='fileItems'>
                            {selectedFiles}
                        </div>
                            {fileBar}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
