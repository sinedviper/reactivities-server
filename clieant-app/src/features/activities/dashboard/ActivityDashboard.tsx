import { Grid } from "semantic-ui-react"
import {observer} from "mobx-react-lite";
import {useEffect} from "react";

import ActivityList from "./ActivityList"
import {useStore} from "../../../app/stores/store.ts";
import LoadingComponent from "../../../app/layout/LoadingComponent.tsx";

export default observer(function ActivityDashboard() {
    const {activityStore} = useStore();
    const {loadActivities, activityRegistry} = activityStore;

    useEffect(() => {
        if(activityRegistry.size === 0) {
            loadActivities()
        }
    }, [loadActivities, activityRegistry.size]);

    if(activityStore.loadingInitial) {
        return <LoadingComponent />
    }
    
    return (
        <Grid>
            <Grid.Column width={"10"}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={"6"}>
                <h2>Activity filters</h2>
            </Grid.Column>
        </Grid>
    )
})