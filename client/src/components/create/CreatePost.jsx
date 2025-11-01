import { useState, useEffect, useContext } from 'react';
import { styled, Box, TextareaAutosize, Button, InputBase, FormControl } from '@mui/material';
import { AddCircle as Add } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';

const Container = styled(Box)(({ theme }) => ({
  margin: '50px 100px',
  [theme.breakpoints.down('md')]: { margin: 0 },
}));

const Image = styled('img')({
  width: '100%',
  height: '50vh',
  objectFit: 'cover',
});

const StyledFormControl = styled(FormControl)`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
`;

const InputTextField = styled(InputBase)`
  flex: 1;
  margin: 0 30px;
  font-size: 25px;
`;

const Textarea = styled(TextareaAutosize)`
  width: 100%;
  border: none;
  margin-top: 50px;
  font-size: 18px;
  &:focus-visible {
    outline: none;
  }
`;

const initialPost = {
  title: '',
  description: '',
  picture: '',
  username: '',
  categories: '',
  createdDate: new Date(),
};

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { account } = useContext(DataContext);

  const [post, setPost] = useState(initialPost);
  const [file, setFile] = useState(null);

  const url = post.picture
    ? post.picture
    : '';

  // Upload image whenever a file is selected
  useEffect(() => {
    const uploadImage = async () => {
      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('name', file.name);

          // Pass 'true' to indicate multipart/form-data
          const response = await API.uploadFile(formData, null, null, true);

          if (response.isSuccess) {
            setPost(prev => ({ ...prev, picture: response.data.imageUrl }));
          } else {
            console.error('Upload failed:', response);
          }
        } catch (err) {
          console.error('Error uploading file:', err);
        }
      }
    };

    uploadImage();
  }, [file]);

  // Set categories and username when component mounts or URL changes
  useEffect(() => {
    setPost(prevPost => ({
      ...prevPost,
      categories: location.search?.split('=')[1] || 'All',
      username: account.username,
    }));
  }, [location.search, account.username]);

  const savePost = async () => {
    let response = await API.createPost(post);
      if (response.isSuccess) {
        navigate('/');
      }
  };

  const handleChange = e => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  return (
    <Container>
      <Image src={url} />

      <StyledFormControl>
        <label htmlFor="fileInput">
          <Add fontSize="large" color="action" />
        </label>
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={e => setFile(e.target.files[0])}
        />
        <InputTextField
          onChange={handleChange}
          name="title"
          placeholder="Title"
        />
        <Button onClick={savePost} variant="contained" color="primary">
          Publish
        </Button>
      </StyledFormControl>

      <Textarea
        rowsMin={5}
        placeholder="Tell your story..."
        name="description"
        onChange={handleChange}
      />
    </Container>
  );
};

export default CreatePost;
