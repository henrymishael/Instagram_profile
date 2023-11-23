import React, { useEffect, useState } from 'react'
import profileIcon from '../assets/profileIcon.svg';
import getPhotoUrl from 'get-photo-url';
import  db  from '../dexie';
import { useLiveQuery } from 'dexie-react-hooks';

const Bio = () => {

    const [userDetails, setUserDetails] = useState({
        name: "Henry Mishael",
        about: "Building Scalble Frontend Applications"
    })

    const [editFormIsOpen, setEditFormIsOpen] = useState(false)
    const [profilePhoto, setProfilePhoto] = useState(profileIcon)

        const setdataFromDb = async () => {
            const userDetailsFromDb = await db.bio.get('info')
            const profilePhotoFromDb = await db.bio.get('profilePhoto')
            userDetailsFromDb && setUserDetails(userDetailsFromDb)
            profilePhotoFromDb && setProfilePhoto(profilePhotoFromDb)
        }

    

    const updateUserDetails = async (event) => {
        event.preventDefault();
        const objectData = ({
            name: event.target.nameOfUser.value,
            about: event.target.aboutUser.value,
        })
        setUserDetails(objectData)
    //update bio object store
    await db.bio.put(objectData, 'info')
    setEditFormIsOpen(false)
    }

    const updateProfilePhoto = async () => {
        const newProfilePhoto = await getPhotoUrl('#profilePhotoInput')
        setProfilePhoto(newProfilePhoto) 
        await db.bio.put(newProfilePhoto, 'profilePhoto')
    }

    const updateBio = useLiveQuery(() => {
       setdataFromDb();
    })

    

    const editForm = (
        <form className='edit-bio-form' onSubmit={(e) => updateUserDetails(e)}>
            <input type="text" name='nameOfUser' id='' placeholder='Your name' defaultValue={userDetails?.name}/>
            <input type="text" name='aboutUser' id='' 
            placeholder='About you' defaultValue={userDetails?.about} />
            <br />
            <button onClick={() => setEditFormIsOpen(false)} type='button' className='cancel-button'>
                Cancel
            </button>
            <button type='submit'>Save</button>

        </form>
    )

    const editButton = <button onClick={() => setEditFormIsOpen(true)}>Edit</button>

  
  return (
   
    <section className='bio'>
        <input type="file" accept='image/*' name='photo' id='profilePhotoInput' />
        <label htmlFor="profilePhotoInput" onClick={updateProfilePhoto}>
            <div className="profile-photo" role='button' title='Click to edit photo' >
                <img src={profilePhoto} alt="profile" />
            </div>
        </label>
        <div className="profile-info">
            <p className='name'></p>{userDetails.name}
            <p className='about'>{userDetails.about}</p>
            {editFormIsOpen ? editForm : editButton}
        </div>
   </section>
  )
}
export default Bio