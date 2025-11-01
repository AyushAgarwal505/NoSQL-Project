import Banner from '../banner/Banner';
import Categories from './Categories';
import { Grid } from '@mui/material';
import Posts from './post/Postss';

const Home = () => {
    return (
        <>
            <Banner />
            <Grid container>
                <Grid item lg={4} sm={4} xs={12}>
                    <Categories />
                </Grid>
                <Grid container item lg={8} sm={8} xs={12}>
                    <Posts />
                </Grid>
            </Grid>
        </>
        
    )
}

export default Home;