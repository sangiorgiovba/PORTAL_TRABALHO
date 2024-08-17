import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "TRAMPO NÃO ENCONTRADO !",
                success: false
            })
        };
  
       const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "VOCE APLICOU PARA ESTE TRAMPO !",
                success: false
            });
        }

    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({
        message: "NAO FOI POSSIVEL ENCONTRAR ESTE TRAMPO !",
        success: false,
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
    
    job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"EMPREGO APLICADO COM SUCCESSO !",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      return res.status(404).json({
        message: "Nenhuma aplicação",
        success: false,
      });
    }
    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "Trabalho não encontrado.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      succees: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "Estatus é necessário",
        success: false,
      });
    }

    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Aplicação não encontrada.",
        success: false,
      });
    }

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Estatus atualizado com sucesso.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
