import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Container,
    Button,
    Typography,
    Avatar,
    makeStyles,
} from "@material-ui/core";
import AuthUserContext, { withAuthorization } from "../../contexts";
import { UserRole } from "../../utils";
import * as ROUTES from "../../constants/routes";
import AssignVolunteerDialog from "../AssignVolunteer";
import Loader from "../Loader";
import { ResolveRequestDialog } from "../Requests";
import useGetRquestDetails from "../../hooks/useGetRequestDetails";

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.grey[800],
        padding: "16px",
        margin: "16px auto",
        borderRadius: 8,

        "&:hover": {
            background: theme.palette.grey[700],
        },
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: "1em",
        flexWrap: "wrap",
    },
    avatar: {
        height: "32px",
        width: "32px",
    },
    name: {
        flex: "1",
        fontSize: 16,
        [theme.breakpoints.down("xs")]: {
            flex: "2",
        },
    },
    messageBox: {
        padding: "16px 0 24px",
    },
    imageBox: {
        textAlign: "center",
        margin: 8,
    },
    image: {
        maxWidth: 480,
        height: "auto",
        [theme.breakpoints.down("xs")]: {
            maxWidth: 270,
        },
    },

    footer: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
    },
}));

const condition = (authUser) => !!authUser;

export default withAuthorization(
    condition,
    ROUTES.SIGNIN
)((props) => {
    const { id } = useParams();
    const classes = useStyles();
    const { authUser } = useContext(AuthUserContext);

    const {
        request,
        openAssignVolunteerModal,
        openResolveRequestModal,
        handleClose,
        fetched,
        toDateTime,
        setOpenAssignVolnteerModal,
        setOpenResolveRequestModal,
    } = useGetRquestDetails(id);

    if (!fetched)
        return (
            <div>
                <Loader />
            </div>
        );
    else
        return Object.keys(request).length !== 0 ? (
            <Container maxWidth="sm" className={classes.root}>
                <Box className={classes.header}>
                    <Avatar
                        className={classes.avatar}
                        alt={`${request.createdBy}`}
                        src={request.imageUrl}
                    ></Avatar>
                    <Typography variant="p" className={classes.name}>
                        {request.createdBy}
                    </Typography>
                    <Typography variant="body1">
                        {toDateTime(request.createdAt)}
                    </Typography>
                </Box>
                <Box className={classes.messageBox}>
                    <Typography variant="h6">{request.title}</Typography>
                    <Typography variant="body2">
                        {request.description ? `${request.description}` : ""}
                    </Typography>
                </Box>
                {request.file && (
                    <Box className={classes.imageBox}>
                        <img
                            src={request.file}
                            className={classes.image}
                            alt=""
                        />
                    </Box>
                )}
                <Box className={classes.footer}>
                    <Button variant="outlined" color="primary" size="small">
                        {request.state === "" ? "State N/A" : request.state}
                    </Button>
                    <Button
                        variant="outlined"
                        color={request.resolved ? "success" : "grey"}
                        size="small"
                    >
                        {request.resolved ? "Resolved" : "Not Resolved"}
                    </Button>
                    {!request.assignedTo && authUser.role === UserRole.Admin && (
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => setOpenAssignVolnteerModal(true)}
                        >
                            Assign Volunteer
                        </Button>
                    )}
                    {!request.resolved &&
                        request.assignedTo &&
                        request.assignedTo === authUser.uid && (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => setOpenResolveRequestModal(true)}
                            >
                                Resolve request
                            </Button>
                        )}
                    {!request.resolved &&
                        request.assignedTo &&
                        request.assignedTo !== authUser.uid && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                            >
                                ASSIGNED
                            </Button>
                        )}
                    <AssignVolunteerDialog
                        id={id}
                        open={openAssignVolunteerModal}
                        handleClose={handleClose}
                    />
                    <ResolveRequestDialog
                        id={id}
                        open={openResolveRequestModal}
                        handleClose={handleClose}
                    />
                </Box>
            </Container>
        ) : (
            <Loader />
        );
});
