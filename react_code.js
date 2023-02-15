import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AxiosInstance from '../../authorization/AxiosInstance';
import CustomizedSnackbars from '../CustomizedSnackbar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const AddProduct = () => {
    const [product_name, setProduct_Name] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [imageUpload, setImageUpload] = useState()
    const [categories, setCategories] = useState([])
    const [categoriesUpload, setCategoriesUpload] = useState([])
    const [flashMessageState, setFlashMessageState] = useState()
    const [flashMessage, setFlashMessage] = useState(null)
    const header = "Add A Product"
    const action = "Add Product"

    const history = useHistory()
    const theme = createTheme();
    const getCategories = () => (
        AxiosInstance.get("/categories").then(response => {
            setCategories(response.data.data)
        })
    )
    const handleFileInput = (event) => {
        setImageUpload(event.target.files[0]);
    };
    const handleCategoryChange = (e) => {
        const catValue = e.target.value
        const CBchecked = e.target.checked
        if (CBchecked) {
            setCategoriesUpload([...categoriesUpload, catValue])
        }
        else if (!CBchecked) {
            setCategoriesUpload(categoriesUpload.filter(cat => cat !== catValue))
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('name', product_name);
        formData.append('description', description);
        formData.append('categories', JSON.stringify(categoriesUpload));
        formData.append('images', imageUpload);
        formData.append('price', price);
        try {
            const response = await AxiosInstance.post("/products", formData)
            setFlashMessage(response.data.message)
            setFlashMessageState('success')
            setTimeout(() => {
                setFlashMessageState('')
                // history.push("/vendor-dashboard")
            }, 4000)
            setProduct_Name("")
            setDescription("")
            setPrice("")
            console.log("Image", response.data.image_url)
            console.log("categoriesUpload", categoriesUpload)
        }
        catch (error) {
            const errors = error.response.data.data
            for (error in errors) {
                setFlashMessage(error + " " + errors[error][0])
                setFlashMessageState('error')
                setTimeout(() => {
                    setFlashMessageState('')
                }, 4000)
            }
        }

    }
    useEffect(() => {
        getCategories()
    }, [])
    return (
        <>
            {flashMessageState && flashMessage !== null ?
                <div className='flash_message'>
                    <CustomizedSnackbars severity={flashMessageState} message={flashMessage} />
                </div>
                : ""}
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <AddIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            {header}
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="product_name"
                                label="Product Name"
                                name="product_name"
                                autoComplete="Product Name"
                                autoFocus
                                value={product_name}
                                onChange={(e) => setProduct_Name(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="description"
                                label="Description"
                                name="description"
                                autoComplete="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="price"
                                label="Price"
                                name="price"
                                autoComplete="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <Input
                                accept="image/*"
                                fullWidth
                                multiple
                                type="file"
                                margin="normal"
                                required
                                id="file"
                                onChange={handleFileInput}
                            />
                            <FormGroup row>
                                {categories.map((category) => {
                                    return (
                                        <FormControlLabel
                                            value={category.id}
                                            control={<Checkbox
                                                onChange={(e) => {
                                                    handleCategoryChange(e);
                                                }} />}
                                            label={category.name} />
                                    )
                                })}
                            </FormGroup>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {action}
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </>

    )
}
export default AddProduct
