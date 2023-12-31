import {makeAutoObservable, runInAction} from "mobx";
import {v4 as uuid} from "uuid";

import {Activity} from "../models/activity.ts";
import agent from "../api/agent.ts";
import {format} from "date-fns";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate () {
        return Array.from(this.activityRegistry.values()).sort((a, b)=> a.date!.getTime() - b.date!.getTime());
    }

    get groundedActivities () {
        return Object.entries(this.activitiesByDate.reduce((activities, activity)=>{
            const date = format(activity.date!, "dd MMM yyyy");
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as {[key: string]: Activity[]})
        )
    }

    loadActivities = async (): Promise<void> => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            activities.forEach((activity: Activity) => {
                this.setActivity(activity);
            })
            this.setLoadingInitial(false);
        } catch (e) {
            console.log(e);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if(activity) {
            this.selectedActivity = activity;
            return activity;
        } else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                runInAction(()=>{
                    this.selectedActivity = activity;
                })
                this.setActivity(activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (e) {
                console.log(e);
                this.setLoadingInitial(false);
            }
        }
    }

    private getActivity = (id: string): Activity => {
        return this.activityRegistry.get(id) as Activity;
    }

    private setActivity = (activity: Activity): void => {
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    setLoadingInitial = (state: boolean): void => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: Activity): Promise<void> => {
        this.loading = true;
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            runInAction(()=>{
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (e) {
            console.log(e);
            runInAction(()=>{
                this.editMode = false;
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity): Promise<void> => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(()=>{
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (e) {
            console.log(e);
            runInAction(()=>{
                this.editMode = false;
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string): Promise<void> => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(()=>{
                this.activityRegistry.delete(id);
                // if(this.selectedActivity?.id === id) {
                //     this.cancelSelectedActivity();
                // }
                this.loading = false;
            })
        } catch (e) {
            console.log(e);
            runInAction(()=>{
                this.loading = false;
            })
        }
    }
}