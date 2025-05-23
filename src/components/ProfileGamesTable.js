import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import amber from "@material-ui/core/colors/amber";
import grey from "@material-ui/core/colors/grey";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";
import StarIcon from "@material-ui/icons/Star";

import { modes } from "../game";
import { formatTime, getColor } from "../util";
import ElapsedTime from "./ElapsedTime";
import Loading from "./Loading";
import User from "./User";

const useStyles = makeStyles((theme) => ({
  gamesTable: {
    display: "flex",
    flexDirection: "column",
    maxHeight: 400,
    marginBottom: theme.spacing(1),
    whiteSpace: "nowrap",
    "& td, & th": {
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 12,
      paddingRight: 12,
    },
    "& svg": {
      display: "block",
    },
    "& th": {
      background: theme.palette.background.panel,
    },
    "& tr": {
      background: theme.profileTable.row,
    },
    "& tr:hover": {
      background: theme.palette.action.hover,
      cursor: "pointer",
    },
  },
  // Remove cells of some columns of table for small screens
  vanishingTableCell: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
}));

function ProfileGamesTable({ userId, gamesData, handleClickGame }) {
  const classes = useStyles();
  const theme = useTheme();

  if (!gamesData) {
    return <Loading />;
  }
  if (Object.keys(gamesData).length === 0) {
    return (
      <Typography style={{ color: grey[400] }}>
        No recent games to display...
      </Typography>
    );
  }
  return (
    <TableContainer component={Paper} className={classes.gamesTable}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Host</TableCell>
            <TableCell>Players</TableCell>
            <TableCell>Mode</TableCell>
            <TableCell>Sets</TableCell>
            <TableCell>Length</TableCell>
            <TableCell className={classes.vanishingTableCell}>
              Created
            </TableCell>
            <TableCell>Practice</TableCell>
            <TableCell>Won</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(gamesData)
            .sort(([, g1], [, g2]) => g2.createdAt - g1.createdAt)
            .map(([gameId, game]) => {
              const modeInfo = modes[game.mode || "normal"];
              return (
                <TableRow key={gameId} onClick={() => handleClickGame(gameId)}>
                  <TableCell>
                    <User id={game.host} />
                  </TableCell>
                  <TableCell>{Object.keys(game.users).length}</TableCell>
                  <TableCell style={{ color: getColor(modeInfo.color, theme) }}>
                    {modeInfo.name}
                  </TableCell>
                  <TableCell>{game.scores[userId] || 0}</TableCell>
                  <TableCell>
                    {formatTime(
                      game.endedAt - game.startedAt - (game.pauseTime ?? 0)
                    )}
                  </TableCell>
                  <TableCell className={classes.vanishingTableCell}>
                    <ElapsedTime value={game.createdAt} />
                  </TableCell>
                  <TableCell>
                    {game.enableHint && <FitnessCenterIcon fontSize="small" />}
                  </TableCell>
                  <TableCell>
                    {game.scores[userId] === game.topScore && (
                      <StarIcon style={{ color: amber[500] }} />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProfileGamesTable;
