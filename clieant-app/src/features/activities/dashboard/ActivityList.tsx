import { SyntheticEvent, useState } from "react";
import { Segment, Item, Button, Label } from "semantic-ui-react"

import {useStore} from "../../../app/stores/store.ts";
import {observer} from "mobx-react-lite";
import {Link} from "react-router-dom";

export default observer(function ActivityList () {
    const {activityStore} = useStore();
    const { activitiesByDate, loading, deleteActivity} = activityStore

    const [target, setTarget] = useState("");
    
    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }
    
    return (
        <Segment>
            <Item.Group divided>
                {activitiesByDate.map((activity)=> (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as={"a"}>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button 
                                    as={Link}
                                    to={`/activities/${activity.id}`}
                                    floated={"right"} 
                                    content={"View"} 
                                    color={"blue"} 
                                    
                                />
                                <Button
                                    name={activity.id}
                                    onClick={(e)=> handleActivityDelete(e, activity.id)}
                                    floated={"right"}
                                    content={"Delete"}
                                    color={"red"}
                                    loading={loading && target === activity.id}
                                />
                                <Label
                                    
                                    basic 
                                    content={activity.category} 
                                />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                    ))}
            </Item.Group>
        </Segment>
    )
})