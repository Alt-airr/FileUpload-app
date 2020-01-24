import React from 'react';
import './css/FileItem.css'

const FileItem = (props) => {
    console.log('index ', props.index)
    const deleteItem = () => {
        props.onItemDelete(props.index)
    };
    const fileType = props.file.type.split('/');
    return (
        <div className={`fileItem ${props.index}`}>
            <div className='col'>
               {props.file.name}
            </div>
            <div className='col'>
                {props.file.size + ' ' + 'байт'}
            </div>
            <div className='col'>
                {fileType[1]}
            </div>
            <div className='col'>
                <button className='del-btn' onClick={deleteItem}>
                    Х
                </button>
            </div>

        </div>
    )
}

export default FileItem;