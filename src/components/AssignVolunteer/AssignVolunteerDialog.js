import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { assignVolunteer, getVolunteers } from "../../contexts/firebase";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexWrap: "wrap",
        width: 280,
    },
    formControl: {
        margin: theme.spacing(1),
        width: "100%",
    },
}));

export default function AssignVolunteerDialog({ id, open, handleClose }) {
    const classes = useStyles();
    const [volunteer, setVolunteer] = useState("");
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setVolunteer(event.target.value);
    };

    useEffect(() => {
        const getVolunteersData = async () => {
            const volunteersData = await getVolunteers();
            console.log(volunteersData);
            setVolunteers(volunteersData);
        };
        getVolunteersData();
    }, []);

    const handleSubmit = async () => {
        if (!volunteer) return;

        try {
            setLoading(true);
            await assignVolunteer(volunteer, id);
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
        handleClose();
        setVolunteer("");
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Assign Volunteer</DialogTitle>
                <DialogContent>
                    <form className={classes.container}>
                        <FormControl className={classes.formControl}>
                            <InputLabel>Select Volunteer</InputLabel>
                            <Select
                                value={volunteer}
                                onChange={handleChange}
                                input={<Input />}
                            >
                                {volunteers.map((v) => (
                                    <MenuItem key={v.id} value={v.id}>
                                        {v.email}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {!loading ? (
                            "Assign"
                        ) : (
                            <CircularProgress size={24} color="secondary" />
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}