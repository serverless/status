import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Heading, HStack, List, Text, ListItem, Grid, Spinner, Tag, VStack, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, useDisclosure, Button, UnorderedList, Skeleton } from "@chakra-ui/react"
import { useTheme } from "@emotion/react"
import { useState } from "react"
import useSWR from "swr"
import { apiClient } from "./api"
import { IncidentDrawer } from "./IncidentDrawer"

import { Resource } from "./Resource"
import { Status } from "./Status"
import { UpdatedAt } from "./UpdatedAt"
import { UpdatesRow } from "./UpdatesRow"
import { getStatusColor } from "./utils"

export const Incidents = () => {

    const theme = useTheme()

    const [selectedIncident, setSelectedIncident] = useState(null)

    const { data } = useSWR('services', (url) => apiClient({ url }))
    const services = data?.services
    console.log('theme',theme)
    return (
        <Box >
            <HStack spacing="24px" justifyContent="space-between">
                <Heading>Incidents</Heading>
                <Button onClick={() => setSelectedIncident({})} colorScheme="red">New Incident</Button>

            </HStack>

            <Resource
                
                path="incidents"
                render={(props) => (
                    <VStack alignItems="flex-start" mt={25} spacing="24px">
                        <IncidentDrawer
                            services={services}
                            selectedIncident={selectedIncident}
                            setSelectedIncident={setSelectedIncident}
                            addIncident={props.addResource}
                            loadingAdd={props.loadingAdd}
                            deleteIncident={props.deleteResource}
                            loadingDelete={props.loadingDelete}
                        />

                        {props.loading ?
                            <>
                                <Skeleton height="125px" width="100%" />
                                <Skeleton height="125px" width="100%" />
                                <Skeleton height="125px" width="100%" />
                            </>
                            : props?.data?.incidents?.sort((a, b) => b.incidentCreatedAt - a.incidentCreatedAt).map(incident => (
                                <Box
                                    onClick={() => {
                                        setSelectedIncident(incident)
                                    }}
                                    css={{
                                        transition: 'all .3s ease-in-out',
                                        '&:hover' : {
                                            backgroundColor: theme.colors.gray[700]
                                        }
                                    }}
                                    key={incident?.incidentId}
                                    spacing={8}
                                    width="100%"
                                    p={5}
                                    shadow="md"
                                    borderWidth="1px"
                                    borderRadius="md"
                                    flex="1"
                                    borderLeftColor={getStatusColor(incident.incidentStatus, theme.colors)}
                                    borderLeftWidth="5px"
                                    cursor="pointer"
                                >
                                    <Grid templateColumns="2fr 1fr" gap={10}>
                                        <VStack alignItems="flex-start">
                                            <HStack >

                                                <Heading as="h2" size="md">
                                                    {incident.incidentName}
                                                </Heading>
                                                <UpdatedAt updatedAt={incident.incidentUpdatedAt} createdAt={incident.incidentCreatedAt} />
                                            </HStack>
                                            <Heading as="h5" size="sm" fontWeight="normal" color="grey">
                                                {incident.incidentDescription}
                                            </Heading>
                                            <UpdatesRow incident={incident} />
                                        </VStack>
                                        <VStack alignItems="flex-start">
                                        
                                                <Heading  as="h5" size="sm">
                                                    Incident Status
                                                </Heading>
                                                
                                                <Status status={incident.incidentStatus} />
                                            <Heading as="h5" size="sm">
                                                Affected Services
                                            </Heading>
                                            <UnorderedList style={{
                                                marginLeft: "20px"
                                            }}>
                                                {services?.filter(service => incident.affectedServicesIds.includes(service.serviceId))
                                                    .map(service => (
                                                        <ListItem key={service.serviceId}>
                                                            {service.serviceName}
                                                        </ListItem>
                                                    ))}
                                            </UnorderedList>
                                        </VStack>
                                    </Grid>


                                </Box>
                            ))}
                    </VStack>
                )}
            />

        </Box>

    )
}