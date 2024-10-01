import React, { useState, useEffect } from "react";
import "./KanbanBoard.css";
import DropdownMenu from "../components/dropdownMenu";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);

  const [grouping, setGrouping] = useState("Status");
  const [ordering, setOrdering] = useState("Priority");
  const [listing, setListing] = useState(undefined);

  // Fetching data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
        const data = await response.json();
        console.log(data); // Debugging purposes
        setTickets(data.tickets);
        setUsers(data.users);
        // setOrdering("Priority");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Grouping:", grouping);
    // status, user, priority
    if (grouping === "Status") {
      const lists = [
        {
          icon: "/icons/backlog.svg",
          heading: "Backlog",
          list: tickets.filter((ticket) => ticket.status === "Backlog"),
        },
        {
          icon: "/icons/todo.svg",
          heading: "Todo",
          list: tickets.filter((ticket) => ticket.status === "Todo"),
        },
        {
          icon: "/icons/inprogress.svg",
          heading: "InProgress",
          list: tickets.filter((ticket) => ticket.status === "In progress"),
        },
        {
          icon: "/icons/done.svg",
          heading: "Done",
          list: tickets.filter((ticket) => ticket.status === "Done"),
        },
        {
          icon: "/icons/cancelled.svg",
          heading: "Cancelled",
          list: tickets.filter((ticket) => ticket.status === "Cancelled"),
        },
      ];
      setListing(lists);
    } else if (grouping === "User") {
      console.log("Grouping by User", users, tickets);
      // const lists = users.map((user) => tickets.filter((ticket) => ticket.assigneeId === user.id));
      const lists = users.map((user) => ({
        icon: "/icons/user.svg",
        heading: user.name,
        list: tickets.filter((ticket) => ticket.userId === user.id),
      }));
      setListing(lists);
    } else if (grouping === "Priority") {
      const lists = [
        { icon:"/icons/nopriority.svg", heading: "No Priority", list: tickets.filter((ticket) => ticket.priority === 0) },
        { icon:"/icons/urgent.svg", heading: "Urgent", list: tickets.filter((ticket) => ticket.priority === 4) },
        { icon:"/icons/high.svg", heading: "High", list: tickets.filter((ticket) => ticket.priority === 3) },
        { icon:"/icons/medium.svg", heading: "Medium", list: tickets.filter((ticket) => ticket.priority === 2) },
        { icon:"/icons/low.svg", heading: "Low", list: tickets.filter((ticket) => ticket.priority === 1) },
      ];
      setListing(lists);
    }
  }, [tickets, grouping]);

  useEffect(() => {
    if (ordering === "Priority") {
      setTickets((prevTickets) => [...prevTickets].sort((a, b) => b.priority - a.priority));
    } else if (ordering === "Title") {
      setTickets((prevTickets) => [...prevTickets].sort((a, b) => a.title.localeCompare(b.title)));
    }
    console.log("Ordering:", ordering);
  }, [grouping, ordering]);

  // Helper function to get user by id
  const getUserById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "Unknown User";
  };

  // Group tickets by actual statuses fetched from the API
  const ticketsByStatus = {
    Todo: tickets.filter((ticket) => ticket.status === "Todo"),
    InProgress: tickets.filter((ticket) => ticket.status === "In progress"),
    Backlog: tickets.filter((ticket) => ticket.status === "Backlog"),
  };

  return (
    <div>
      <DropdownMenu
        grouping={grouping}
        ordering={ordering}
        setGrouping={setGrouping}
        setOrdering={setOrdering}
      />
      <div className="kanban-board">
        {listing &&
          listing.map((list) => (
            <KanbanColumn
              key={list.heading}
              heading={list.heading}
              list={list.list}
              icon={list.icon}
            />
          ))}
        {/* <KanbanColumn heading="Todo" list={ticketsByStatus.Todo} />
      <KanbanColumn heading="InProgress" list={ticketsByStatus.InProgress} />
      <KanbanColumn heading="Backlog" list={ticketsByStatus.Backlog} />
      <KanbanColumn heading="Done" list={ticketsByStatus.Done} />
      <KanbanColumn heading="Cancelled" list={ticketsByStatus.Cancelled} /> */}
      </div>
    </div>
  );
};

export default KanbanBoard;

const KanbanColumn = ({ heading, list, icon }) => {
  return (
    <div className="column">
      <div className="header">
        <div style={{display: "flex", alignItems: "center"}}>
          {icon && (
            <img
              src={icon}
              alt="icon"
              height={18}
              style={{ marginLeft: "5px" }}
            />
          )}
          <h3 className="column-title">
            {heading}
            <span className="ticket-count">{list?.length || 0}</span>
          </h3>
        </div>
        <span className="icon-container">
          <button className="icon-button">+</button>
          <button className="icon-button icondot">...</button>
        </span>
      </div>
      {list &&
        list.map((ticket) => (
          <div className="card" key={ticket.id}>
            <div style={{display:"flex", justifyContent: "space-between"}}>
            <plaintext>{ticket.id}</plaintext>
            <img src="icons/user.svg" height={20} alt="ticket" style={{marginTop:"10px"}}/>
            </div>
            <h4 className="ticket-title">{ticket.title}</h4>
            <span className="ellipse">...</span> {/* Added ellipse */}
            <span className="tag">{ticket.tag.join(", ")}</span>
          </div>
        ))}
    </div>
  );
};
