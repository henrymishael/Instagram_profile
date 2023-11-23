import getPhotoUrl from 'get-photo-url';
import db from '../dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { Loader } from './Loader';



const Gallery = () => {
  const [isLoading, setLoading] = useState(true)

  function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
    const allPhotos = useLiveQuery(() => 
    
    db.gallery.toArray(),
    [])

    const addPhoto = async () => {
      
      db.gallery.add({
            url: await getPhotoUrl('#addPhotoInput')
        })
    }

    const removePhoto = (id) => {
        db.gallery.delete(id)
    }
       
  return (
    <>
    <input type="file" name='photo' id='addPhotoInput' />
    <label htmlFor="addPhotoInput" onClick={addPhoto}>
        <i className='add-photo-button fas fa-plus-square'></i>
    </label>

    <section className='gallery'>
        {!allPhotos && <div className='w-[100vw] h-[100vh] flex items-center justify-center'> <Loader /></div>}
      {allPhotos?.map((photo) => (
        <div className='item' key={photo?.id}>
            <img src={photo?.url}  className={cn('group-hover:opacity-75 duration-700 ease-in-out item-image', 
                 isLoading 
                     ? 'grayscale blur-2xl scale-110'
                     : 'grayscale-0 blur-0 scale-100'
                 )}
                 onLoadingComplete={() => setLoading(false)} alt='' />
            <button onClick={() => {removePhoto(photo.id)}} className='delete-button'>Delete</button>
        </div>
      ))}
    </section>
    </>
  )
}

export default Gallery
